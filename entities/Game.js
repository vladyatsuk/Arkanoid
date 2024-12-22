import { RIGHT_BORDER } from '../config/canvas.js';
import { START_POS_Y as START_BALL_POS_Y } from '../config/ball.js';
import { START_PLAYER_POS_X } from '../config/player.js';
import { INDENT } from '../config/game.js';

import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import ScoreManager from './ScoreManager.js';
import LevelManager from './LevelManager.js';
import BrickManager from './BrickManager.js';

class Game {
  renderer;
  ball;
  player;
  bricks;
  levelManager;
  scoreManager;

  constructor({
    renderer,
    ball,
    player,
    levelManager = new LevelManager(),
    scoreManager = new ScoreManager(),
  }) {
    this.renderer = renderer;
    this.ball = ball;
    this.player = player;
    this.levelManager = levelManager;
    this.scoreManager = scoreManager;
  }

  get isLoss() {
    const { ball, player } = this;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const { bricks, renderer, scoreManager, levelManager } = this;

    if (BrickManager.isLevelDone(bricks)) {
      renderer.drawHeader(`You won level ${levelManager.currentLevel} :)`);
      scoreManager.resetScore();
      levelManager.incrementLevelIndex();

      if (levelManager.isLastLevel) {
        renderer.drawHeader('You won the last level :)');
        levelManager.resetLevelIndex();
      }

      this.reset();
    }

    if (this.isLoss) {
      levelManager.resetLevelIndex();
      renderer.drawHeader('You lost :(');
      this.reset();
    }

    scoreManager.updateBestScore();
    renderer.drawScores(scoreManager.scores);
  }

  init() {
    const { levelManager } = this;
    this.bricks = BrickManager.createBricks(levelManager.levelStructure);
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Game.generateRandomPosition();
    this.ball.y = START_BALL_POS_Y;

    Controls.setControls(this.player, this.renderer, this.ball);
  }

  reset() {
    const { ball, player, scoreManager } = this;
    scoreManager.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = START_PLAYER_POS_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    this.init();
  }

  removeBrickIfHit() {
    const { ball, bricks, scoreManager, levelManager } = this;

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
    const { ball, player, bricks, renderer, scoreManager } = this;

    if (player.canLaunchBall) {
      player.x = START_PLAYER_POS_X;
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
    return Math.random() * (RIGHT_BORDER - 2 * INDENT) + INDENT;
  }
}

export default Game;
