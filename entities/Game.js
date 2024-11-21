import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RIGHT_BORDER,
  START_X,
  START_Y,
} from '../config/canvas.js';

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

class Game {
  ctx;
  header;
  scoreLabel;
  bestScoreLabel;
  score;
  bestScore;
  levelIndex;
  ball;
  player;
  bricks;

  constructor({
    ctx,
    header,
    scoreLabel,
    bestScoreLabel,
    score,
    bestScore,
    levelIndex,
    ball,
    player,
    bricks,
  }) {
    this.ctx = ctx;
    this.header = header;
    this.scoreLabel = scoreLabel;
    this.bestScoreLabel = bestScoreLabel;
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
        const { header, ball } = this;
        header.innerHTML = 'Break all the bricks!';
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

  drawScore() {
    const { score, scoreLabel, bestScoreLabel } = this;

    if (score > this.bestScore) this.bestScore = score;
    scoreLabel.innerHTML = `Score: ${score}`;
    bestScoreLabel.innerHTML = `Best score: ${this.bestScore}`;
  }

  drawFrame() {
    this.clearCanvas();
    this.drawBall();
    this.drawBricks();
    this.drawPlayer();
    this.drawScore();
  }

  isLoss() {
    const { ball, player } = this;

    return ball.top > player.bottom;
  }

  showGameStatus() {
    const { header, bricks } = this;

    if (this.score === BASE_REWARD * this.getCurrentLevel() * bricks.length) {
      this.score = 0;
      this.levelIndex += 1;
      header.innerHTML = `You won level ${this.levelIndex} :)`;

      if (this.levelIndex === LAST_LEVEL) {
        header.innerHTML = 'You won the last level :)';
        this.levelIndex = 0;
      }

      this.reset();
    }

    if (this.isLoss()) {
      this.levelIndex = 0;
      header.innerHTML = 'You lost :(';
      this.reset();
    }

    this.drawScore();
  }

  init() {
    const level = LEVELS[this.levelIndex];
    this.bricks = [];
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Game.generateRandomPosition();
    this.ball.y = START_BALL_POS_Y;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level.length; x++) {
        if (level[y][x]) {
          this.bricks.push(new Brick({
            ctx: this.ctx,
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
    this.score = 0;
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

      if (brick.active && ball.hitBrick(brick)) {
        this.score += BASE_REWARD * this.getCurrentLevel();
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playGame() {
    const { ball, player } = this;

    if (player.canLaunchBall) player.x = START_PLAYER_POS_X;
    if (ball.hitCeiling) ball.bounceOffCeiling();
    if (ball.hitWalls) ball.bounceOffWalls();
    if (ball.hitPlayer(player)) ball.bounceOffPlayer(player);
    player.move();
    ball.move();
    this.removeBrickIfHit();
    this.drawFrame();
    this.showGameStatus();
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (RIGHT_BORDER - 2 * INDENT) + INDENT;
  }

  getCurrentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }

  clearCanvas() {
    this.ctx.clearRect(START_X, START_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawPlayer() {
    const { player } = this;
    player.draw(
      player.color,
      player.x,
      player.y,
      player.width,
      player.height,
    );
  }

  drawBall() {
    const { ball } = this;
    ball.draw(ball.color, ball.x, ball.y, ball.r);
  }

  drawBricks() {
    const { bricks } = this;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active) {
        brick.draw(
          this.ctx,
          brick.color,
          brick.x,
          brick.y,
          brick.width,
          brick.height,
        );
      }
    }
  }
}

export default Game;
