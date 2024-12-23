import {
  PLAYER_LEFT_DIRECTION,
  PLAYER_RIGHT_DIRECTION,
} from '../constants/player.js';
import {
  BALL_LEFT_DIRECTION,
  BALL_RIGHT_DIRECTION,
} from '../constants/ball.js';
import { GAME_DELAY } from '../constants/game.js';
import { STATES } from '../constants/gameState.js';
import { COMMANDS } from '../constants/commands.js';

import Ball from './Ball.js';
import Player from './Player.js';
import PlayerEngine from './PlayerEngine.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallEngine from './BallEngine.js';
import ScoreManager from './ScoreManager.js';
import LevelManager from './LevelManager.js';
import EntityFactory from './EntityFactory.js';
import GameState from './GameState.js';
import GameMessage from './GameMessage.js';

class Game {
  #ball;
  #player;
  #bricks;
  #scoreManager;
  #levelManager;
  #gameState;
  #controls;
  #renderer;
  #gameMessage;

  constructor({
    levelManager = new LevelManager(),
    scoreManager = new ScoreManager(),
    gameState = new GameState(),
    ball = new Ball(),
    player = new Player(),
    gameMessage = new GameMessage(),
    renderer,
  }) {
    this.#ball = ball;
    this.#player = player;
    this.#scoreManager = scoreManager;
    this.#levelManager = levelManager;
    this.#gameState = gameState;
    this.#controls = new Controls();
    this.#renderer = renderer;
    this.#gameMessage = gameMessage;

    this.#gameMessage.set('Press \'s\' to play!');
    this.#createLevel();
  }

  get #isLoss() {
    const ball = this.#ball,
          player = this.#player;

    return ball.top > player.bottom;
  }

  #handleWaiting() {
    const ball = this.#ball,
          gameState = this.#gameState,
          controls = this.#controls;

    if (controls.isActive(COMMANDS.LAUNCH_BALL)) {
      BallEngine.launch(ball);
      gameState.transition(STATES.PLAYING);
    }
  }

  #handlePlaying() {
    const ball = this.#ball,
          player = this.#player,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager,
          gameState = this.#gameState,
          controls = this.#controls,
          gameMessage = this.#gameMessage;

    gameMessage.set('Break all the bricks!');

    if (CollisionDetector.hitCeiling(ball)) {
      BallEngine.reverseSpeedY(ball);
    }

    if (CollisionDetector.hitWalls(ball)) {
      BallEngine.reverseSpeedX(ball);
    }

    if (CollisionDetector.hitPlayer(ball, player)) {
      if (controls.isActive(COMMANDS.MOVE_LEFT)) {
        BallEngine.bounceX(ball, BALL_LEFT_DIRECTION);
      }

      if (controls.isActive(COMMANDS.MOVE_RIGHT)) {
        BallEngine.bounceX(ball, BALL_RIGHT_DIRECTION);
      }

      BallEngine.reverseSpeedY(ball);
    }

    for (const brick of bricks) {
      if (CollisionDetector.hitBrick(ball, brick)) {
        scoreManager.increaseScore(levelManager.currentLevel);
        scoreManager.updateBestScore();
        bricks.delete(brick);
        BallEngine.reverseSpeedY(ball);
        break;
      }
    }

    if (controls.isActive(COMMANDS.MOVE_LEFT)) {
      PlayerEngine.move(player, PLAYER_LEFT_DIRECTION);
    }

    if (controls.isActive(COMMANDS.MOVE_RIGHT)) {
      PlayerEngine.move(player, PLAYER_RIGHT_DIRECTION);
    }

    BallEngine.move(ball);

    if (!bricks.size) {
      gameState.transition(STATES.LEVEL_DONE);
    } else if (this.#isLoss) {
      gameState.transition(STATES.LOST);
    }
  }

  #handleLevelDone() {
    const scoreManager = this.#scoreManager,
          levelManager = this.#levelManager,
          gameState = this.#gameState,
          gameMessage = this.#gameMessage;

    gameMessage.set(`You won level ${levelManager.currentLevel} :)`);
    scoreManager.resetScore();
    levelManager.incrementLevelIndex();

    if (levelManager.isLastLevel) {
      gameMessage.set('You won the last level :)');
      levelManager.resetLevelIndex();
    }

    this.#createLevel();
    gameState.transition(STATES.WAITING);
  }

  #handleLost() {
    const levelManager = this.#levelManager,
          gameState = this.#gameState,
          gameMessage = this.#gameMessage;

    levelManager.resetLevelIndex();
    gameMessage.set('You lost :(');
    this.#createLevel();
    gameState.transition(STATES.WAITING);
  }

  #createLevel() {
    const ball = this.#ball,
          player = this.#player,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    scoreManager.resetScore();
    BallEngine.stop(ball);
    BallEngine.resetPosition(ball);
    PlayerEngine.resetPosition(player);
    this.#bricks = EntityFactory.createBricks(levelManager.levelStructure);
  }

  #loop() {
    const renderer = this.#renderer,
          ball = this.#ball,
          player = this.#player,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager,
          gameState = this.#gameState,
          gameMessage = this.#gameMessage;

    const handler = {
      [STATES.WAITING]: () => {
        this.#handleWaiting();
      },
      [STATES.PLAYING]: () => {
        this.#handlePlaying();
      },
      [STATES.LEVEL_DONE]: () => {
        this.#handleLevelDone();
      },
      [STATES.LOST]: () => {
        this.#handleLost();
      },
    }[gameState.state];

    if (!handler) {
      throw new Error(`Unhandled state: ${gameState.state}`);
    }

    handler();
    renderer.drawFrame(
      { ball, bricks, player },
      scoreManager.scores,
      gameMessage.value,
    );
  }

  start() {
    setInterval(() => this.#loop(), GAME_DELAY);
  }
}

export default Game;
