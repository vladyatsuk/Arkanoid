import { CANVAS_RIGHT } from '../constants/canvas.js';
import { BALL_START_Y } from '../constants/ball.js';
import { PLAYER_START_X } from '../constants/player.js';
import { GAME_INDENT, GAME_DELAY } from '../constants/game.js';

import Ball from './Ball.js';
import Player from './Player.js';
import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import ScoreManager from './ScoreManager.js';
import LevelManager from './LevelManager.js';
import BrickManager from './BrickManager.js';
import EntityFactory from './EntityFactory.js';

class Game {
  #levelManager;
  #scoreManager;
  #ball;
  #player;
  #bricks;
  #renderer;

  constructor({
    levelManager = new LevelManager(),
    scoreManager = new ScoreManager(),
    ball = new Ball(),
    player = new Player(),
    renderer,
  }) {
    this.#levelManager = levelManager;
    this.#scoreManager = scoreManager;
    this.#ball = ball;
    this.#player = player;
    this.#renderer = renderer;
    Controls.setControls(player, renderer, ball);
    this.createLevel();
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

      this.createLevel();
    }

    if (this.isLoss) {
      levelManager.resetLevelIndex();
      renderer.drawGameMessage('You lost :(');
      this.createLevel();
    }

    scoreManager.updateBestScore();
    renderer.drawScores(scoreManager.scores);
  }

  createLevel() {
    const ball = this.#ball,
          player = this.#player,
          scoreManager = this.#scoreManager,
          levelManager = this.#levelManager;

    scoreManager.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = PLAYER_START_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    ball.y = BALL_START_Y;
    this.#bricks = EntityFactory.createBricks(levelManager.levelStructure);
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
        BrickManager.remove(brick);
        ball.speedY *= -1;
        break;
      }
    }
  }

  #loop() {
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

  start() {
    setInterval(() => this.#loop(), GAME_DELAY);
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (CANVAS_RIGHT - 2 * GAME_INDENT) + GAME_INDENT;
  }
}

export default Game;
