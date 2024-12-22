import { RIGHT_BORDER } from '../config/canvas.js';
import { START_POS_Y as START_BALL_POS_Y } from '../config/ball.js';
import { START_PLAYER_POS_X } from '../config/player.js';
import { BASE_REWARD, INDENT } from '../config/game.js';

import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import LevelManager from './LevelManager.js';
import LevelData from './LevelData.js';

class Game {
  renderer;
  score;
  bestScore;
  ball;
  player;
  levelData = new LevelData();

  constructor({
    renderer,
    score,
    bestScore,
    ball,
    player,
  }) {
    this.renderer = renderer;
    this.score = score;
    this.bestScore = bestScore;
    this.ball = ball;
    this.player = player;
  }

  resetScore() {
    this.score = 0;
  }

  increaseScore() {
    const { levelData } = this;

    this.score += BASE_REWARD * levelData.currentLevel;
  }

  updateBestScore() {
    const { score } = this;

    if (score > this.bestScore) this.bestScore = score;
  }

  get isLoss() {
    const { ball, player } = this;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const { renderer, levelData } = this;

    if (levelData.isLevelDone) {
      renderer.drawHeader(`You won level ${levelData.currentLevel} :)`);
      this.resetScore();
      LevelManager.incrementLevelIndex(levelData);

      if (levelData.isLastLevel) {
        renderer.drawHeader('You won the last level :)');
        LevelManager.resetLevelIndex(levelData);
      }

      this.reset();
    }

    if (this.isLoss) {
      LevelManager.resetLevelIndex(levelData);
      renderer.drawHeader('You lost :(');
      this.reset();
    }

    this.updateBestScore();
    renderer.drawScores(this.score, this.bestScore);
  }

  init() {
    const { levelData } = this;
    LevelManager.initLevel(levelData);
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Game.generateRandomPosition();
    this.ball.y = START_BALL_POS_Y;

    Controls.setControls(this.player, this.renderer, this.ball);
  }

  reset() {
    const { ball, player } = this;
    this.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = START_PLAYER_POS_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    this.init();
  }

  removeBrickIfHit() {
    const { ball } = this;
    const { bricks } = this.levelData;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active && CollisionDetector.hitBrick(ball, brick)) {
        this.increaseScore();
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playGame() {
    const { ball, player, renderer } = this;
    const { bricks } = this.levelData;

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
    renderer.drawScores(this.score, this.bestScore);
    this.showGameStatus();
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (RIGHT_BORDER - 2 * INDENT) + INDENT;
  }
}

export default Game;
