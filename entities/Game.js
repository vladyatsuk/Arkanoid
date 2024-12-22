import { CANVAS_RIGHT } from '../constants/canvas.js';
import { BALL_START_Y } from '../constants/ball.js';
import { PLAYER_START_X } from '../constants/player.js';
import { GAME_INDENT, GAME_DELAY } from '../constants/game.js';
import { STATES } from '../constants/gameState.js';

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
  #levelManager;
  #scoreManager;
  #gameState;
  #ball;
  #player;
  #bricks;
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
    this.#levelManager = levelManager;
    this.#scoreManager = scoreManager;
    this.#gameState = gameState;
    this.#ball = ball;
    this.#player = player;
    this.#gameMessage = gameMessage;
    this.#renderer = renderer;
    this.#gameMessage.set('Press \'s\' to play!');
    Controls.setControls(ball, this.#gameState);
    this.#createLevel();
  }

  get #isLoss() {
    const ball = this.#ball,
          player = this.#player;

    return ball.top > player.bottom;
  }

  #handleWaiting() {
    const player = this.#player;

    player.x = PLAYER_START_X;
  }

  #handlePlaying() {
    const ball = this.#ball,
          player = this.#player,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    this.#gameMessage.set('Break all the bricks!');

    if (CollisionDetector.hitCeiling(ball)) {
      BallEngine.bounceOffCeiling(ball);
    }

    if (CollisionDetector.hitWalls(ball)) {
      BallEngine.bounceOffWalls(ball);
    }

    if (CollisionDetector.hitPlayer(ball, player)) {
      BallEngine.bounceOffPlayer(ball);
    }

    for (const brick of bricks) {
      if (CollisionDetector.hitBrick(ball, brick)) {
        scoreManager.increaseScore(levelManager.currentLevel);
        scoreManager.updateBestScore();
        bricks.delete(brick);
        BallEngine.bounceOffBrick(ball);
        break;
      }
    }

    PlayerEngine.move(player);
    BallEngine.move(ball);
    if (!bricks.size) {
      this.#gameState.transition(STATES.LEVEL_DONE);
    } else if (this.#isLoss) {
      this.#gameState.transition(STATES.LOST);
    }
  }

  #handleLevelDone() {
    const scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    this.#gameMessage.set(`You won level ${levelManager.currentLevel} :)`);
    scoreManager.resetScore();
    levelManager.incrementLevelIndex();

    if (levelManager.isLastLevel) {
      this.#gameMessage.set('You won the last level :)');
      levelManager.resetLevelIndex();
    }

    this.#createLevel();
    this.#gameState.transition(STATES.WAITING);
  }

  #handleLost() {
    const levelManager = this.#levelManager;

    levelManager.resetLevelIndex();
    this.#gameMessage.set('You lost :(');
    this.#createLevel();
    this.#gameState.transition(STATES.WAITING);
  }

  #createLevel() {
    const ball = this.#ball,
          player = this.#player,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    scoreManager.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = PLAYER_START_X;
    ball.x = Game.generateRandomPosition();
    ball.y = BALL_START_Y;
    this.#bricks = EntityFactory.createBricks(levelManager.levelStructure);
  }

  #loop() {
    const renderer = this.#renderer,
          ball = this.#ball,
          player = this.#player,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager;

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
    }[this.#gameState.state];

    if (!handler) {
      throw new Error(`Unhandled state: ${this.#gameState.state}`);
    }

    handler();
    renderer.drawEntities({ ball, bricks, player });
    renderer.drawScores(scoreManager.scores);
    renderer.drawGameMessage(this.#gameMessage.value);
  }

  start() {
    setInterval(() => this.#loop(), GAME_DELAY);
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (CANVAS_RIGHT - 2 * GAME_INDENT) + GAME_INDENT;
  }
}

export default Game;
