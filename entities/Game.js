import { RIGHT_BORDER } from '../config/canvas.js';
import { START_POS_Y as START_BALL_POS_Y } from '../config/ball.js';
import { START_PLAYER_POS_X } from '../config/player.js';
import { INDENT } from '../config/game.js';

import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import LevelManager from './LevelManager.js';
import LevelData from './LevelData.js';
import ScoreSystem from './ScoreSystem.js';

class Game {
  renderer;
  ball;
  player;
  levelData = new LevelData();
  scoreSystem = new ScoreSystem();

  constructor({
    renderer,
    ball,
    player,
  }) {
    this.renderer = renderer;
    this.ball = ball;
    this.player = player;
  }

  get isLoss() {
    const { ball, player } = this;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const { renderer, levelData, scoreSystem } = this;

    if (levelData.isLevelDone) {
      renderer.drawHeader(`You won level ${levelData.currentLevel} :)`);
      scoreSystem.resetScore();
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

    scoreSystem.updateBestScore();
    renderer.drawScores(scoreSystem.scores);
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
    const { ball, player, scoreSystem } = this;
    scoreSystem.resetScore();
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = START_PLAYER_POS_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    this.init();
  }

  removeBrickIfHit() {
    const { ball, levelData, scoreSystem } = this;
    const { bricks, currentLevel } = levelData;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active && CollisionDetector.hitBrick(ball, brick)) {
        scoreSystem.increaseScore(currentLevel);
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playGame() {
    const { ball, player, renderer, scoreSystem } = this;
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
    renderer.drawScores(scoreSystem.scores);
    this.showGameStatus();
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (RIGHT_BORDER - 2 * INDENT) + INDENT;
  }
}

export default Game;
