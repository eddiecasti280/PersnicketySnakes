class SnakeGame {
    constructor() {
        this.gridSize = 8;
        this.grid = [];
        this.snake = [];
        this.trail = []; // Track the path taken
        this.snake2 = []; // Second snake for Level 3
        this.trail2 = []; // Second snake's trail
        this.spawnPoint = { x: 0, y: 0 };
        this.spawnPoint2 = { x: 0, y: 0 }; // Second snake spawn point
        this.goal = { x: 7, y: 7 };
        this.goal2 = { x: 7, y: 7 }; // Second snake's goal
        this.fruits = []; // Track fruit positions
        this.energy = 10;
        this.maxEnergy = 10;
        this.energy2 = 10; // Second snake's energy
        this.maxEnergy2 = 10; // Second snake's max energy
        this.gameWon = false;
        this.gameLost = false;
        this.snake1GoalReached = false; // Track if snake 1 reached its goal
        this.snake2GoalReached = false; // Track if snake 2 reached its goal
        this.currentLevel = 1;
        this.removableObstacles = []; // Track obstacles that can be removed
        this.activeSnake = 1; // Not used in simultaneous movement mode // Not used in simultaneous movement mode
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.createGrid();
        this.createSnake();
        this.updateDisplay();
        this.updateEnergyDisplay();
    }
    
    createGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = 'empty';
            }
        }
        
        // Set spawn point and goal
        this.grid[this.spawnPoint.y][this.spawnPoint.x] = 'spawn';
        this.grid[this.goal.y][this.goal.x] = 'goal';
        
        // Create level-specific content
        if (this.currentLevel === 1) {
            this.createLevel1();
        } else if (this.currentLevel === 2) {
            this.createLevel2();
        } else if (this.currentLevel === 3) {
            this.createLevel3();
        }
    }
    
    createLevel1() {
        // Add some obstacles for the first level
        this.addObstacles();
        
        // Add some fruits for energy
        this.addFruits();
    }
    
    createLevel2() {
        // Create a smaller 6x6 level for level 2
        this.gridSize = 6;
        this.goal = { x: 5, y: 5 };
        
        // Recreate grid with new size
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = 'empty';
            }
        }
        
        // Set spawn and goal
        this.grid[this.spawnPoint.y][this.spawnPoint.x] = 'spawn';
        this.grid[this.goal.y][this.goal.x] = 'goal';
        
        // Add permanent obstacles that block some paths but not all
        const permanentObstacles = [
            { x: 1, y: 2 }, { x: 2, y: 2 }, // Block some middle area
            { x: 1, y: 3 }, { x: 2, y: 3 },
            { x: 3, y: 1 }, { x: 4, y: 1 }  // Block some top area
        ];
        
        permanentObstacles.forEach(obs => {
            this.grid[obs.y][obs.x] = 'obstacle';
        });
        
        // Add rocks that block the exit initially
        const exitBlockingRocks = [
            { x: 4, y: 4 }, { x: 5, y: 4 }, // Block goal from below
            { x: 4, y: 5 }  // Block goal from left
        ];
        
        exitBlockingRocks.forEach(obs => {
            this.grid[obs.y][obs.x] = 'obstacle';
        });
        
        // Add one trashcan that will remove the exit-blocking rocks
        this.removableObstacles = [
            { x: 3, y: 3 } // Single trashcan that removes exit-blocking rocks
        ];
        
        this.removableObstacles.forEach(obs => {
            this.grid[obs.y][obs.x] = 'removable-obstacle';
        });
        
        // Add a fruit near the trashcan
        const fruitPositions = [
            { x: 2, y: 4 } // Near the trashcan but not overlapping
        ];
        
        fruitPositions.forEach(fruit => {
            if (this.grid[fruit.y] && this.grid[fruit.y][fruit.x] === 'empty') {
                this.grid[fruit.y][fruit.x] = 'fruit';
                this.fruits.push(fruit);
            }
        });
    }
    
    createLevel3() {
        // Create a 10x8 level for level 3 with two snakes
        this.gridSize = 10;
        this.goal = { x: 9, y: 7 }; // Bottom right
        
        // Recreate grid with new size
        this.grid = [];
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = 'empty';
            }
        }
        
        // Set spawn points and goals
        this.spawnPoint = { x: 0, y: 0 }; // Left snake (top-left)
        this.spawnPoint2 = { x: 9, y: 0 }; // Right snake (top-right)
        this.goal = { x: 7, y: 7 }; // Left snake's goal (bottom-right)
        this.goal2 = { x: 7, y: 6 }; // Right snake's goal (where rocks were blocking)
        this.grid[this.spawnPoint.y][this.spawnPoint.x] = 'spawn';
        this.grid[this.spawnPoint2.y][this.spawnPoint2.x] = 'spawn2';
        this.grid[this.goal.y][this.goal.x] = 'goal';
        this.grid[this.goal2.y][this.goal2.x] = 'goal2';
        
        // Create narrow hallway for right snake (top row)
        for (let x = 1; x < this.gridSize - 1; x++) {
            this.grid[0][x] = 'empty'; // Hallway is clear
        }
        
        // Add button at end of right snake's hallway
        this.removableObstacles = [
            { x: 8, y: 0 } // Button at end of hallway
        ];
        
        this.removableObstacles.forEach(obs => {
            this.grid[obs.y][obs.x] = 'removable-obstacle';
        });
        
        // Add obstacles that block right snake's goal (will be cleared by right snake's button)
        const rightSnakeObstacles = [
            { x: 6, y: 6 }, { x: 8, y: 6 }, // Block goal from sides
            { x: 7, y: 5 }  // Block goal from above
        ];
        
        rightSnakeObstacles.forEach(obs => {
            this.grid[obs.y][obs.x] = 'obstacle';
        });
        
        // Add some other obstacles for challenge
        const otherObstacles = [
            { x: 2, y: 2 }, { x: 3, y: 2 },
            { x: 5, y: 4 }, { x: 6, y: 4 },
            { x: 1, y: 5 }, { x: 2, y: 5 }
        ];
        
        otherObstacles.forEach(obs => {
            this.grid[obs.y][obs.x] = 'obstacle';
        });
        
        // Add fruits for energy
        const fruitPositions = [
            { x: 1, y: 1 }, { x: 4, y: 3 },
            { x: 6, y: 6 }, { x: 3, y: 7 }
        ];
        
        fruitPositions.forEach(fruit => {
            if (this.grid[fruit.y] && this.grid[fruit.y][fruit.x] === 'empty') {
                this.grid[fruit.y][fruit.x] = 'fruit';
                this.fruits.push(fruit);
            }
        });
    }
    
    addObstacles() {
        // Add some obstacles to make the level interesting
        const obstacles = [
            { x: 2, y: 2 }, { x: 3, y: 2 },
            { x: 5, y: 5 }, { x: 6, y: 5 },
            { x: 1, y: 6 }, { x: 2, y: 6 }
        ];
        
        obstacles.forEach(obs => {
            if (this.grid[obs.y] && this.grid[obs.y][obs.x]) {
                this.grid[obs.y][obs.x] = 'obstacle';
            }
        });
    }
    
    addFruits() {
        // Add some fruits strategically placed
        const fruitPositions = [
            { x: 1, y: 1 }, { x: 4, y: 3 }, { x: 6, y: 4 },
            { x: 2, y: 7 }, { x: 5, y: 1 }
        ];
        
        fruitPositions.forEach(fruit => {
            if (this.grid[fruit.y] && this.grid[fruit.y][fruit.x] === 'empty') {
                this.grid[fruit.y][fruit.x] = 'fruit';
                this.fruits.push(fruit);
            }
        });
    }
    
    createSnake() {
        this.snake = [this.spawnPoint];
        this.trail = [this.spawnPoint];
        this.grid[this.spawnPoint.y][this.spawnPoint.x] = 'snake';
        
        // For Level 3, create second snake
        if (this.currentLevel === 3) {
            this.snake2 = [this.spawnPoint2];
            this.trail2 = [this.spawnPoint2];
            this.grid[this.spawnPoint2.y][this.spawnPoint2.x] = 'snake2';
        }
    }
    
    setupEventListeners() {
        // Arrow key controls
        document.addEventListener('keydown', (e) => {
            if (this.gameWon) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveSnake(0, -1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveSnake(0, 1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveSnake(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveSnake(1, 0);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.resetLevel();
                    break;
            }
        });
        
        // Button controls
        document.getElementById('move-up').addEventListener('click', () => this.moveSnake(0, -1));
        document.getElementById('move-down').addEventListener('click', () => this.moveSnake(0, 1));
        document.getElementById('move-left').addEventListener('click', () => this.moveSnake(-1, 0));
        document.getElementById('move-right').addEventListener('click', () => this.moveSnake(1, 0));
        
        // Reset button
        document.getElementById('reset-level').addEventListener('click', () => this.resetLevel());
        
        // Next level button
        document.getElementById('next-level').addEventListener('click', () => this.nextLevel());
        
        // README modal buttons
        document.getElementById('show-readme').addEventListener('click', () => {
            this.showReadme();
        });
        
        document.getElementById('close-readme').addEventListener('click', () => {
            this.hideReadme();
        });
        
        // Close modal when clicking outside
        document.getElementById('readme-modal').addEventListener('click', (e) => {
            if (e.target.id === 'readme-modal') {
                this.hideReadme();
            }
        });
        
        // Snake switching removed - both snakes move together in Level 3
    }
    
    
    moveSnake(dx, dy) {
        if (this.gameWon) return;
        
        // For Level 3, move both snakes simultaneously
        if (this.currentLevel === 3) {
            this.moveSnake1(dx, dy);
            this.moveSnake2(dx, dy);
            return;
        }
        
        // Original single snake logic for levels 1-2
        const head = this.snake[0];
        const newX = head.x + dx;
        const newY = head.y + dy;
        
        // Check if we have energy OR if we're retracing (which gives energy back)
        const isRetracing = this.trail.some(pos => pos.x === newX && pos.y === newY);
        
        if (this.energy <= 0 && !isRetracing) return;
        
        // Check boundaries
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize) {
            this.showMessage("Can't move outside the grid!", 'failure');
            return;
        }
        
        // Check for obstacles
        if (this.grid[newY][newX] === 'obstacle') {
            this.showMessage("Can't move through obstacles!", 'failure');
            return;
        }
        
        // Check if we're moving onto a removable obstacle (trashcan)
        if (this.grid[newY][newX] === 'removable-obstacle') {
            // Trigger the obstacle removal
            this.removeObstacle(newX, newY);
        }
        
        // Check if we're moving to the same position
        if (newX === head.x && newY === head.y) {
            return;
        }
        
        if (isRetracing) {
            // If retracing, remove the old trail up to this point and gain back energy
            const energyGained = this.removeTrailToPosition(newX, newY);
            this.energy += energyGained;
        } else {
            // Add new position to trail
            this.trail.unshift({ x: newX, y: newY });
        }
        
        // Move snake
        this.snake.unshift({ x: newX, y: newY });
        
        // Check if we collected a fruit
        if (this.grid[newY][newX] === 'fruit') {
            this.maxEnergy++; // Increase maximum energy capacity
            this.energy++; // Restore 1 energy
            this.grid[newY][newX] = 'empty'; // Remove fruit from grid
            this.fruits = this.fruits.filter(fruit => !(fruit.x === newX && fruit.y === newY));
            this.showMessage("Snake 1 collected fruit! Energy +1, Max energy +1!", 'success');
        }
        
        // Check if we reached the goal
        if (newX === this.goal.x && newY === this.goal.y) {
            this.gameWon = true;
            this.showMessage("Congratulations! Snake 1 reached the goal!", 'success');
            this.showNextLevelButton();
            this.updateDisplay();
            return;
        }
        
        // Update energy (only if not retracing)
        if (!isRetracing) {
            this.energy--;
        }
        
        
        this.updateDisplay();
        this.updateEnergyDisplay();
    }
    
    moveSnake1(dx, dy) {
        // Move left snake (snake 1)
        const head = this.snake[0];
        const newX = head.x + dx;
        const newY = head.y + dy;
        
        // Check if we have energy OR if we're retracing (which gives energy back)
        const isRetracing = this.trail.some(pos => pos.x === newX && pos.y === newY);
        
        if (this.energy <= 0 && !isRetracing) return;
        
        // Check boundaries
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize) {
            return; // Silently fail for simultaneous movement
        }
        
        // Check for obstacles
        if (this.grid[newY][newX] === 'obstacle') {
            return; // Silently fail for simultaneous movement
        }
        
        // Check if we're moving to the same position
        if (newX === head.x && newY === head.y) {
            return;
        }
        
        // Check if the other snake is already at this position
        if (this.snake2.length > 0 && this.snake2[0].x === newX && this.snake2[0].y === newY) {
            return; // Silently fail if other snake is there
        }
        
        if (isRetracing) {
            // If retracing, remove the old trail up to this point and gain back energy
            const energyGained = this.removeTrailToPosition(newX, newY);
            this.energy += energyGained;
        } else {
            // Add new position to trail
            this.trail.unshift({ x: newX, y: newY });
        }
        
        // Move snake
        this.snake.unshift({ x: newX, y: newY });
        
        // Check if we collected a fruit
        if (this.grid[newY][newX] === 'fruit') {
            this.maxEnergy++; // Increase maximum energy capacity
            this.energy++; // Restore 1 energy
            this.grid[newY][newX] = 'empty'; // Remove fruit from grid
            this.fruits = this.fruits.filter(fruit => !(fruit.x === newX && fruit.y === newY));
            this.showMessage("Snake 1 collected fruit! Energy +1, Max energy +1!", 'success');
        }
        
        // Check if we reached the goal
        if (newX === this.goal.x && newY === this.goal.y) {
            this.snake1GoalReached = true;
            this.showMessage("Snake 1 reached its goal!", 'success');
            this.checkBothGoalsReached();
            this.updateDisplay();
            return;
        }
        
        // Update energy (only if not retracing)
        if (!isRetracing) {
            this.energy--;
        }
        
        this.updateDisplay();
        this.updateEnergyDisplay();
    }
    
    moveSnake2(dx, dy) {
        // Move right snake (snake 2)
        const head = this.snake2[0];
        const newX = head.x + dx;
        const newY = head.y + dy;
        
        // Check if we have energy OR if we're retracing (which gives energy back)
        const isRetracing = this.trail2.some(pos => pos.x === newX && pos.y === newY);
        
        if (this.energy2 <= 0 && !isRetracing) return;
        
        // Check boundaries
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize) {
            return; // Silently fail for simultaneous movement
        }
        
        // Check for obstacles
        if (this.grid[newY][newX] === 'obstacle') {
            return; // Silently fail for simultaneous movement
        }
        
        // Check if we're moving to the same position
        if (newX === head.x && newY === head.y) {
            return;
        }
        
        // Check if the other snake is already at this position
        if (this.snake.length > 0 && this.snake[0].x === newX && this.snake[0].y === newY) {
            return; // Silently fail if other snake is there
        }
        
        if (isRetracing) {
            // If retracing, remove the old trail up to this point and gain back energy
            const energyGained = this.removeTrailToPosition2(newX, newY);
            this.energy2 += energyGained;
        } else {
            // Add new position to trail
            this.trail2.unshift({ x: newX, y: newY });
        }
        
        // Move snake
        this.snake2.unshift({ x: newX, y: newY });
        
        // Check if we're moving onto a removable obstacle (button)
        if (this.grid[newY][newX] === 'removable-obstacle') {
            // Trigger the obstacle removal
            this.removeObstacle(newX, newY);
        }
        
        // Check if we collected a fruit
        if (this.grid[newY][newX] === 'fruit') {
            this.maxEnergy2++; // Increase maximum energy capacity
            this.energy2++; // Restore 1 energy
            this.grid[newY][newX] = 'empty'; // Remove fruit from grid
            this.fruits = this.fruits.filter(fruit => !(fruit.x === newX && fruit.y === newY));
            this.showMessage("Snake 2 collected fruit! Energy +1, Max energy +1!", 'success');
        }
        
        // Check if we reached the goal
        if (newX === this.goal2.x && newY === this.goal2.y) {
            this.snake2GoalReached = true;
            this.showMessage("Snake 2 reached its goal!", 'success');
            this.checkBothGoalsReached();
            this.updateDisplay();
            return;
        }
        
        // Update energy (only if not retracing)
        if (!isRetracing) {
            this.energy2--;
        }
        
        this.updateDisplay();
        this.updateEnergyDisplay();
    }
    
    checkBothGoalsReached() {
        if (this.currentLevel === 3 && this.snake1GoalReached && this.snake2GoalReached) {
            this.gameWon = true;
            this.showMessage("Congratulations! Both snakes reached their goals! Level completed!", 'success');
            this.showNextLevelButton();
        }
    }
    
    removeTrailToPosition(x, y) {
        // Find the index of the position we're retracing to
        const retraceIndex = this.trail.findIndex(pos => pos.x === x && pos.y === y);
        
        if (retraceIndex !== -1) {
            // Calculate how many moves we're retracing (energy to gain back)
            const energyGained = retraceIndex;
            
            // Remove all trail positions after the retrace point
            this.trail = this.trail.slice(retraceIndex);
            
            return energyGained;
        }
        
        return 0;
    }
    
    removeTrailToPosition2(x, y) {
        // Find the index of the position we're retracing to for snake 2
        const retraceIndex = this.trail2.findIndex(pos => pos.x === x && pos.y === y);
        
        if (retraceIndex !== -1) {
            // Calculate how many moves we're retracing (energy to gain back)
            const energyGained = retraceIndex;
            
            // Remove all trail positions after the retrace point
            this.trail2 = this.trail2.slice(retraceIndex);
            
            // Remove corresponding snake segments
            this.snake2 = this.snake2.slice(retraceIndex);
            
            return energyGained;
        }
        
        return 0;
    }
    
    updateDisplay() {
        const gameGrid = document.getElementById('game-grid');
        gameGrid.innerHTML = '';
        
        // Set the grid template based on current grid size
        gameGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 40px)`;
        gameGrid.style.gridTemplateRows = `repeat(${this.gridSize}, 40px)`;
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                const cell = document.createElement('div');
                
                // Check if this position is in the trail
                const isInTrail = this.trail.some(pos => pos.x === x && pos.y === y);
                const isInTrail2 = this.trail2.some(pos => pos.x === x && pos.y === y);
                const isSnakeHead = this.snake.length > 0 && this.snake[0].x === x && this.snake[0].y === y;
                const isSnakeHead2 = this.snake2.length > 0 && this.snake2[0].x === x && this.snake2[0].y === y;
                
                if (isSnakeHead) {
                    cell.className = 'grid-cell snake';
                    cell.textContent = '🐍';
                } else if (isSnakeHead2) {
                    cell.className = 'grid-cell snake2';
                    cell.textContent = '🐍';
                } else if (isInTrail) {
                    cell.className = 'grid-cell trail';
                    cell.textContent = '●';
                } else if (isInTrail2) {
                    cell.className = 'grid-cell trail2';
                    cell.textContent = '●';
                } else if (this.grid[y][x] === 'goal') {
                    cell.className = 'grid-cell goal';
                    cell.textContent = '🎯';
                } else if (this.grid[y][x] === 'goal2') {
                    cell.className = 'grid-cell goal2';
                    cell.textContent = '🎯';
                } else if (this.grid[y][x] === 'spawn') {
                    cell.className = 'grid-cell spawn';
                    cell.textContent = '🚀';
                } else if (this.grid[y][x] === 'spawn2') {
                    cell.className = 'grid-cell spawn2';
                    cell.textContent = '🚀';
                } else if (this.grid[y][x] === 'obstacle') {
                    cell.className = 'grid-cell obstacle';
                    cell.textContent = '🪨';
                } else if (this.grid[y][x] === 'removable-obstacle') {
                    cell.className = 'grid-cell removable-obstacle';
                    cell.textContent = '🗑️';
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => this.removeObstacle(x, y));
                } else if (this.grid[y][x] === 'fruit') {
                    cell.className = 'grid-cell fruit';
                    cell.textContent = '🍊';
                } else {
                    cell.className = 'grid-cell empty';
                }
                
                gameGrid.appendChild(cell);
            }
        }
    }
    
    updateEnergyDisplay() {
        const energyGrid = document.getElementById('energy-grid');
        
        energyGrid.innerHTML = '';
        
        if (this.currentLevel === 3) {
            // Show both energy bars for Level 3
            energyGrid.style.display = 'flex';
            energyGrid.style.flexDirection = 'column';
            energyGrid.style.gap = '10px';
            
            const snake1Container = document.createElement('div');
            snake1Container.className = 'energy-container';
            snake1Container.innerHTML = '<div class="energy-label">Snake 1</div>';
            
            const snake1Grid = document.createElement('div');
            snake1Grid.style.display = 'grid';
            snake1Grid.style.gridTemplateColumns = 'repeat(5, 20px)';
            snake1Grid.style.gap = '2px';
            snake1Grid.style.justifyContent = 'center';
            
            for (let i = 0; i < this.maxEnergy; i++) {
                const tile = document.createElement('div');
                tile.className = `energy-tile ${i < this.energy ? 'available' : 'used'}`;
                snake1Grid.appendChild(tile);
            }
            
            snake1Container.appendChild(snake1Grid);
            
            const snake2Container = document.createElement('div');
            snake2Container.className = 'energy-container';
            snake2Container.innerHTML = '<div class="energy-label">Snake 2</div>';
            
            const snake2Grid = document.createElement('div');
            snake2Grid.style.display = 'grid';
            snake2Grid.style.gridTemplateColumns = 'repeat(5, 20px)';
            snake2Grid.style.gap = '2px';
            snake2Grid.style.justifyContent = 'center';
            
            for (let i = 0; i < this.maxEnergy2; i++) {
                const tile = document.createElement('div');
                tile.className = `energy-tile ${i < this.energy2 ? 'available' : 'used'}`;
                snake2Grid.appendChild(tile);
            }
            
            snake2Container.appendChild(snake2Grid);
            
            energyGrid.appendChild(snake1Container);
            energyGrid.appendChild(snake2Container);
        } else {
            // Single energy bar for levels 1-2
            energyGrid.style.display = 'grid';
            energyGrid.style.gridTemplateColumns = 'repeat(5, 30px)';
            energyGrid.style.gridTemplateRows = 'repeat(2, 30px)';
            energyGrid.style.gap = '3px';
            energyGrid.style.justifyContent = 'center';
            
            for (let i = 0; i < this.maxEnergy; i++) {
                const tile = document.createElement('div');
                tile.className = `energy-tile ${i < this.energy ? 'available' : 'used'}`;
                energyGrid.appendChild(tile);
            }
        }
        
        // Disable movement buttons only if game is won
        const buttons = document.querySelectorAll('.control-btn');
        buttons.forEach(btn => {
            btn.disabled = this.gameWon;
        });
    }
    
    showMessage(message, type) {
        const status = document.getElementById('game-status');
        status.textContent = message;
        status.className = `game-status ${type}`;
    }
    
    async showReadme() {
        try {
            // Fetch the README.md file
            const response = await fetch('README.md');
            const readmeText = await response.text();
            
            // Convert markdown to HTML (basic conversion)
            const htmlContent = this.convertMarkdownToHtml(readmeText);
            
            // Display in modal
            document.getElementById('readme-content').innerHTML = htmlContent;
            document.getElementById('readme-modal').style.display = 'flex';
        } catch (error) {
            console.error('Error loading README:', error);
            document.getElementById('readme-content').innerHTML = '<p>Error loading instructions. Please check if README.md exists.</p>';
            document.getElementById('readme-modal').style.display = 'flex';
        }
    }
    
    hideReadme() {
        document.getElementById('readme-modal').style.display = 'none';
    }
    
    convertMarkdownToHtml(markdown) {
        // Basic markdown to HTML conversion
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');
        
        // Wrap in paragraphs
        html = '<p>' + html + '</p>';
        
        // Clean up empty paragraphs
        html = html.replace(/<p><\/p>/gim, '');
        html = html.replace(/<p><br><\/p>/gim, '');
        
        return html;
    }
    
    resetLevel() {
        this.energy = this.maxEnergy;
        this.energy2 = this.maxEnergy2;
        this.gameWon = false;
        this.snake1GoalReached = false;
        this.snake2GoalReached = false;
        this.snake = [];
        this.trail = [];
        this.snake2 = [];
        this.trail2 = [];
        this.fruits = [];
        this.activeSnake = 1; // Not used in simultaneous movement mode
        this.createGrid();
        this.createSnake();
        this.updateDisplay();
        this.updateEnergyDisplay();
        this.showMessage("Use arrow keys or buttons to move the snake to the goal! Collect fruits for energy!", '');
    }
    
    showNextLevelButton() {
        if (this.currentLevel < 3) {
            document.getElementById('next-level').style.display = 'inline-block';
        }
    }
    
    nextLevel() {
        this.currentLevel++;
        document.getElementById('current-level').textContent = this.currentLevel;
        document.getElementById('next-level').style.display = 'none';
        
        // Reset game state
        this.gameWon = false;
        this.snake1GoalReached = false;
        this.snake2GoalReached = false;
        this.snake = [];
        this.trail = [];
        this.snake2 = [];
        this.trail2 = [];
        this.fruits = [];
        this.removableObstacles = [];
        this.activeSnake = 1; // Not used in simultaneous movement mode
        
        // Reset energy for new level
        this.energy = 10;
        this.maxEnergy = 10;
        this.energy2 = 10;
        this.maxEnergy2 = 10;
        
        // Reset grid size to default before creating new level
        this.gridSize = 8;
        this.spawnPoint = { x: 0, y: 0 };
        this.spawnPoint2 = { x: 0, y: 0 };
        
        // Create new level
        this.createGrid();
        this.createSnake();
        this.updateDisplay();
        this.updateEnergyDisplay();
        if (this.currentLevel === 3) {
            this.showMessage(`Level ${this.currentLevel}! Both snakes move together! Use arrow keys or buttons to coordinate both snakes!`, '');
        } else {
            this.showMessage(`Level ${this.currentLevel}! Use arrow keys or buttons to move the snake to the goal!`, '');
        }
    }
    
    removeObstacle(x, y) {
        // Remove a removable obstacle
        this.removableObstacles = this.removableObstacles.filter(obs => !(obs.x === x && obs.y === y));
        this.grid[y][x] = 'empty';
        
        // If this is the trashcan, remove the exit-blocking rocks
        if (x === 3 && y === 3) {
            const exitBlockingRocks = [
                { x: 4, y: 4 }, { x: 5, y: 4 }, // Block goal from below
                { x: 4, y: 5 }  // Block goal from left
            ];
            
            exitBlockingRocks.forEach(rock => {
                this.grid[rock.y][rock.x] = 'empty';
            });
            
            this.showMessage("Trashcan activated! Exit rocks removed!", 'success');
        } else if (x === 8 && y === 0) {
            // Level 3: Right snake's button removes obstacles for right snake's goal
            const rightSnakeObstacles = [
                { x: 6, y: 6 }, { x: 8, y: 6 }, // Block goal from sides
                { x: 7, y: 5 }  // Block goal from above
            ];
            
            rightSnakeObstacles.forEach(rock => {
                this.grid[rock.y][rock.x] = 'empty';
            });
            
            this.showMessage("Button activated! Right snake's goal cleared!", 'success');
        } else {
            this.showMessage("Obstacle removed!", 'success');
        }
        
        // Update the display to show the changes
        this.updateDisplay();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
