import { RIGHT_BORDER } from '../config/canvas.js';
import { START_POS_Y as START_BALL_POS_Y } from '../config/ball.js';
import { START_PLAYER_POS_X } from '../config/player.js';
import { INDENT } from '../config/game.js';

import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';
import Controls from './Controls.js';
import BallPhysics from './BallPhysics.js';
import ScoreSystem from './ScoreSystem.js';
import LevelSystem from './LevelSystem.js';

class Game {
  renderer;
  ball;
  player;
  levelSystem;
  scoreSystem;

  constructor({
    renderer,
    ball,
    player,
    levelSystem = new LevelSystem(),
    scoreSystem = new ScoreSystem(),
  }) {
    this.renderer = renderer;
    this.ball = ball;
    this.player = player;
    this.levelSystem = levelSystem;
    this.scoreSystem = scoreSystem;
  }

  get isLoss() {
    const { ball, player } = this;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const { renderer, scoreSystem, levelSystem } = this;

    if (levelSystem.isLevelDone) {
      renderer.drawHeader(`You won level ${levelSystem.currentLevel} :)`);
      scoreSystem.resetScore();
      levelSystem.incrementLevelIndex();

      if (levelSystem.isLastLevel) {
        renderer.drawHeader('You won the last level :)');
        levelSystem.resetLevelIndex();
      }

      this.reset();
    }

    if (this.isLoss) {
      levelSystem.resetLevelIndex();
      renderer.drawHeader('You lost :(');
      this.reset();
    }

    scoreSystem.updateBestScore();
    renderer.drawScores(scoreSystem.scores);
  }

  init() {
    const { levelSystem } = this;
    levelSystem.createBricks();
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
    const { ball, scoreSystem, levelSystem } = this;
    const { bricks } = levelSystem;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active && CollisionDetector.hitBrick(ball, brick)) {
        scoreSystem.increaseScore(levelSystem.currentLevel);
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playGame() {
    const { ball, player, renderer, scoreSystem, levelSystem } = this;
    const { bricks } = levelSystem;

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
