import { CANVAS_RIGHT } from '../constants/canvas.js';
import { BALL_START_Y } from '../constants/ball.js';
import { PLAYER_START_X } from '../constants/player.js';
import { GAME_INDENT } from '../constants/game.js';

import Ball from './Ball.js';
import Player from './Player.js';
import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import ScoreManager from './ScoreManager.js';
import LevelManager from './LevelManager.js';
import BrickManager from './BrickManager.js';

class Game {
  #renderer;
  #ball;
  #player;
  #bricks;
  #levelManager;
  #scoreManager;

  constructor({
    renderer,
    ball = new Ball(),
    player = new Player(),
    levelManager = new LevelManager(),
    scoreManager = new ScoreManager(),
  }) {
    this.#renderer = renderer;
    this.#ball = ball;
    this.#player = player;
    this.#levelManager = levelManager;
    this.#scoreManager = scoreManager;
  }

  get isLoss() {
    const ball = this.#ball,
          player = this.#player;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const bricks = this.#bricks,
          renderer = this.#renderer,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    if (BrickManager.isLevelDone(bricks)) {
      renderer.drawGameMessage(`You won level ${levelManager.currentLevel} :)`);
      scoreManager.resetScore();
      levelManager.incrementLevelIndex();

      if (levelManager.isLastLevel) {
        renderer.drawGameMessage('You won the last level :)');
        levelManager.resetLevelIndex();
      }

      this.reset();
    }

    if (this.isLoss) {
      levelManager.resetLevelIndex();
      renderer.drawGameMessage('You lost :(');
      this.reset();
    }

    scoreManager.updateBestScore();
    renderer.drawScores(scoreManager.scores);
  }

  init() {
    const player = this.#player,
          ball = this.#ball,
          levelManager = this.#levelManager,
          renderer = this.#renderer;

    this.#bricks = BrickManager.createBricks(levelManager.levelStructure);
    player.x = PLAYER_START_X;
    ball.x = Game.generateRandomPosition();
    ball.y = BALL_START_Y;

    Controls.setControls(player, renderer, ball);
  }

  reset() {
    const ball = this.#ball,
          player = this.#player,
          scoreManager = this.#scoreManager;

    scoreManager.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = PLAYER_START_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    this.init();
  }

  removeBrickIfHit() {
    const ball = this.#ball,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active && CollisionDetector.hitBrick(ball, brick)) {
        scoreManager.increaseScore(levelManager.currentLevel);
        BrickManager.removeBrick(brick);
        ball.speedY *= -1;
        break;
      }
    }
  }

  playGame() {
    const ball = this.#ball,
          player = this.#player,
          bricks = this.#bricks,
          scoreManager = this.#scoreManager,
          renderer = this.#renderer;

    if (player.canLaunchBall) {
      player.x = PLAYER_START_X;
    }

    if (CollisionDetector.hitCeiling(ball)) {
      BallPhysics.bounceOffCeiling(ball);
    }

    if (CollisionDetector.hitWalls(ball)) {
      BallPhysics.bounceOffWalls(ball);
    }

    if (CollisionDetector.hitPlayer(ball, player)) {
      BallPhysics.bounceOffPlayer(ball, player);
    }

    Mover.movePlayer(player);
    Mover.moveBall(ball);
    this.removeBrickIfHit();
    renderer.drawEntities({ ball, bricks, player });
    renderer.drawScores(scoreManager.scores);
    this.showGameStatus();
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (CANVAS_RIGHT - 2 * GAME_INDENT) + GAME_INDENT;
  }
}

export default Game;
