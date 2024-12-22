import { RIGHT_BORDER } from '../config/canvas.js';

import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../config/brick.js';

import { START_POS_Y as START_BALL_POS_Y } from '../config/ball.js';
import { START_PLAYER_POS_X } from '../config/player.js';

import {
  BASE_REWARD,
  LEVELS,
  LAST_LEVEL,
  COLORS,
  INDENT,
} from '../config/game.js';

import Brick from './Brick.js';
import Mover from './Mover.js';
import CollisionDetector from './CollisionDetector.js';

class Game {
  renderer;
  score;
  bestScore;
  levelIndex;
  ball;
  player;
  bricks;

  constructor({
    renderer,
    score,
    bestScore,
    levelIndex,
    ball,
    player,
    bricks,
  }) {
    this.renderer = renderer;
    this.score = score;
    this.bestScore = bestScore;
    this.levelIndex = levelIndex;
    this.ball = ball;
    this.player = player;
    this.bricks = bricks;
  }

  handleKeyDown(event) {
    const { code } = event;
    const { player } = this;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      player.leftKey = true;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      player.rightKey = true;
    }
  }

  handleKeyUp(event) {
    const { code } = event;
    const { player } = this;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      player.leftKey = false;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      player.rightKey = false;
    }
  }

  handleGameStartOnKeys(event) {
    const { code } = event;
    const { player } = this;

    if (code === 'KeyS' || code === 'ArrowDown') {
      if (player.canLaunchBall) {
        const { renderer, ball } = this;
        renderer.drawHeader('Break all the bricks!');
        ball.speedX = player.speed;
        ball.speedY = player.speed;
        player.canLaunchBall = false;
      }
    }
  }

  setControls() {
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });
    document.addEventListener('keyup', (event) => {
      this.handleKeyUp(event);
    });
    document.addEventListener('keydown', (event) => {
      this.handleGameStartOnKeys(event);
    });
  }

  get isFullLevelScore() {
    const { bricks } = this;

    return this.score === BASE_REWARD * this.currentLevel * bricks.length;
  }

  get levelData() {
    return LEVELS[this.levelIndex];
  }

  incrementLevelIndex() {
    this.levelIndex += 1;
  }

  get isLastLevel() {
    return this.levelIndex === LAST_LEVEL;
  }

  resetLevelIndex() {
    this.levelIndex = 0;
  }

  resetScore() {
    this.score = 0;
  }

  increaseScore() {
    this.score += BASE_REWARD * this.currentLevel;
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
    const { renderer } = this;

    if (this.isFullLevelScore) {
      renderer.drawHeader(`You won level ${this.currentLevel} :)`);
      this.resetScore();
      this.incrementLevelIndex();

      if (this.isLastLevel) {
        renderer.drawHeader('You won the last level :)');
        this.resetLevelIndex();
      }

      this.reset();
    }

    if (this.isLoss) {
      this.resetLevelIndex();
      renderer.drawHeader('You lost :(');
      this.reset();
    }

    this.updateBestScore();
    renderer.drawScores(this.score, this.bestScore);
  }

  init() {
    const level = this.levelData;
    this.bricks = [];
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Game.generateRandomPosition();
    this.ball.y = START_BALL_POS_Y;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level.length; x++) {
        if (level[y][x]) {
          this.bricks.push(new Brick({
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: BRICK_X_OFFSET + x * BRICK_WIDTH,
            y: BRICK_Y_OFFSET + y * BRICK_HEIGHT,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
          }));
        }
      }
    }

    this.setControls();
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
    const { ball, bricks } = this;

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
    const { ball, bricks, player, renderer } = this;

    if (player.canLaunchBall) player.x = START_PLAYER_POS_X;
    if (CollisionDetector.hitCeiling(ball)) ball.bounceOffCeiling();
    if (CollisionDetector.hitWalls(ball)) ball.bounceOffWalls();
    if (CollisionDetector.hitPlayer(ball, player)) ball.bounceOffPlayer(player);
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

  get currentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }
}

export default Game;
