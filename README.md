# Persnickety Snakes
This is a snake-based puzzle game. You can also see this file in your browser by running the game.

Thanks for checking out my project! Used Cursor to implement.

## How to Run
1. Start local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000` in browser

## Disclaimer
In the final game, text will not be displayed. Instead, UI components like energy will be represented simply with squares away from the game space for each snake. Moreover, there will be no "Reset Level" button or text denoting which level is being played. Text is only included to make sure that human players understand what is occurring within the game.

The final game will also not use emojis and will instead represent each entity with solid squares with different colors. These squares can be seen in the level planning Google Sheets document.

Also expect some bugs with the second snake (third level) as the game shown is meant to be a proof of concept showing off mechanics and not the final game.

Thank you!

## Controls
- Use arrow keys to move a snake. Traversed grid spaces are able to be retraced.
- Press "F" to reset the level

### Full List
- ←: Move left
- ↑: Move up
- →: Move right
- ↓: Move down
- F: Reset level

Five total actions that can be taken.

## Entities
- 🐍 Player Snake(s)
- •: Traversed Path
- 🍊 Fruit: Energy +1 & Max. Energy +1
- 🪨 Rock: Blocks the player, some can be removed with a button
- 🎯 Goal
- 🗑️ Button: Removes rock obstacles

## Mechanics
### Mechanic 1: Food Gauge
- Concept: The snake's movement is limited by the energy bar, denoting the number of grid spaces that can be traversed. To restore this gauge, the snake can trace back the steps that have been taken. The snake can also eat food to increase its maximum gauge.
- Visual: Green squares that are set aside from the interactive game screen. One gauge per snake.
- Learning: Once a few levels have been played, the player may learn that moving into a wall will pause movement for a snake while allowing another snake to move.

### Mechanic 2: Buttons
- Concept: The snake must traverse over buttons to remove parts of the stage or to activate the goal. For example, removing a wall to access a new part of the level.
- Visual: Buttons can be any color that is not being used (e.g. goal, snake, etc.)
- Progression: Upon the addition of multiple buttons, snakes may need to stand on the same color button at once to activate an event.

### Mechanic 3: Multiple Snakes
- Concept: Multiple snakes may be part of a level with their respective spawn points. Each snake will move with each input, simultaneously.
- Visual: If needed, have the snakes be slightly different shades to avoid confusion for the player.
- Learning: The player will need to take advantage of using walls to stop snake movement so that the other snake can move in a different direction or use the food gauge to their advantage.
- Progression: The mechanic will be introduced a few levels into the game once the player has familiarized themselves with the first few mechanics.