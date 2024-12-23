# Arkanoid

## About
This is an implementation of an old arcade game.
The goal is to move the platform and bounce the ball to break all bricks.
The game has 3 levels. With each level, you gain more point for breaking a brick.
Currently, there are 3 levels implemented. If you lose, you lose all your points.

## How to play

1. Go to [vladyatsuk.github.io/Arkanoid/](vladyatsuk.github.io/Arkanoid/)
2. To start playing, press `S` or `ArrowDown` keys.
3. To move the player, press `A`/`ArrowLeft` and `D`/`ArrowRight`.
4. Have fun!

## Implementation

- `Ball`, `Brick` and `Player` implement the entities on the level
- `EntityFactory` instantiates the entities
- `ScoreState`, `LevelState` and `GamePhaseState` store the state of the game
- `ScoreManager`, `LevelManager`, and `GamePhaseManager` are used to change the state of the corresponding state classes
- `GameLogicState` and `GameLogicManager` combine the state and manager classes
- `UiState` and `UiManager` store and update the data for rendering by the `Renderer` class
- `Renderer` draws the entities and the UI (scores, game message). Currently, it is tied to the Canvas2D context API for rendering
- `CollisionDetector`, `BallEngine` and `PlayerEngine` are used for collision detection between entities and update of their attributes (position, speed)
- `Controls` stores the information about pressed keys, which can be used by other classes
- `GamePhaseHandler` executes the appropriate actions depending on the current game phase (`WAITING`, `PLAYING`, `LEVEL_DONE`, `LOST`)
- The main `Game` class combines everything and starts the game loop

## Example
The game looks like this:

![image](https://user-images.githubusercontent.com/90204297/175833362-0e171573-e324-47c9-bb99-a1dc3b155906.png)