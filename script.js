import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TOP_BORDER,
  RIGHT_BORDER,
  LEFT_BORDER,
  CANVAS_HORIZONTAL_CENTER,
  CANVAS_VERTICAL_CENTER,
} from './config/canvas.js';

import {
  BALL_RADIUS,
  SPEED,
  BOOST,
  START_BALL_POS_Y,
  BALL_COLOR,
} from './config/ball.js';

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  START_PLAYER_POS_X,
  START_PLAYER_POS_Y,
  PLAYER_COLOR,
} from './config/player.js';

import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from './config/brick.js';

import {
  DELAY,
  BASE_REWARD,
  START_BRICKS,
  START_SCORE,
  START_BEST_SCORE,
  START_LEVEL_INDEX,
  LEVELS,
  LAST_LEVEL,
  COLORS,
} from './config/game.js';

class Brick {
  width;
  height;

  constructor({ x, y, color }) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get left() {
    return this.x;
  }

  draw(ctx, color, x, y, width, height) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

class Player {
  x = START_PLAYER_POS_X;
  y = START_PLAYER_POS_Y;
  leftKey = false;
  rightKey = false;
  canLaunchBall = true;

  constructor({ ctx, header, width, height, speed, ball }) {
    this.ctx = ctx;
    this.header = header;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.ball = ball;
  }

  get top() {
    return this.y;
  }

  get right() {
    return this.x + this.width;
  }

  get bottom() {
    return this.y + this.height;
  }

  get left() {
    return this.x;
  }

  draw(color, x, y, width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  get leftKeyPressed() {
    return this.leftKey;
  }

  get rightKeyPressed() {
    return this.rightKey;
  }

  get nextPosition() {
    if (this.leftKeyPressed) {
      const leftmostPossiblePosition = LEFT_BORDER;
      this.x = Math.max(leftmostPossiblePosition, this.x - this.speed);
    }

    if (this.rightKeyPressed) {
      const rightmostPossiblePosition = RIGHT_BORDER - this.width;
      this.x = Math.min(rightmostPossiblePosition, this.x + this.speed);
    }

    return this.x;
  }

  move() {
    this.x = this.nextPosition;
  }

  setControls() {
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = true;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = false;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = false;
      }
    });
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyS' || code === 'ArrowDown') {
        if (this.canLaunchBall) {
          const { header, ball } = this;
          header.innerHTML = 'Break all the bricks!';
          ball.speedX = this.speed;
          ball.speedY = this.speed;
          this.canLaunchBall = false;
        }
      }
    });
  }
}

class Ball {
  x = CANVAS_HORIZONTAL_CENTER;
  y = CANVAS_VERTICAL_CENTER;
  speedX = 0;
  speedY = 0;

  constructor({ ctx, r }) {
    this.ctx = ctx;
    this.r = r;
  }

  get top() {
    return this.y - this.r;
  }

  get right() {
    return this.x + this.r;
  }

  get bottom() {
    return this.y + this.r;
  }

  get left() {
    return this.x - this.r;
  }

  draw(color, x, y, r) {
    const { ctx } = this;

    const startAngle = 0,
          // eslint-disable-next-line no-magic-numbers
          fullCircle = 2 * Math.PI;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, startAngle, fullCircle, false);
    ctx.fill();
    ctx.restore();
  }

  move() {
    this.x += this.speedX;
    this.y -= this.speedY;
  }

  get hitWalls() {
    const hitLeftWall = this.left + this.speedX <= LEFT_BORDER,
          hitRightWall = this.right + this.speedX >= RIGHT_BORDER;

    return hitLeftWall || hitRightWall;
  }

  get hitCeiling() {
    return this.top + this.speedY <= TOP_BORDER;
  }

  belowPlayer(player) {
    return this.top > player.bottom;
  }

  hitPlayer(player) {
    return this.bottom >= player.top &&
      this.x >= player.left &&
      this.x <= player.right;
  }

  hitBrick(brick) {
    return brick.left < this.right &&
      this.left < brick.right &&
      brick.top < this.bottom &&
      this.top < brick.bottom;
  }

  bounceOffCeilingIfHit() {
    if (this.hitCeiling) {
      this.speedY *= -1;
      this.y += BOOST;
    }
  }

  bounceOffWallsIfHit() {
    if (this.hitWalls) {
      this.speedX *= -1;
    }
  }

  bounceOffPlayerIfHit(player) {
    if (this.hitPlayer(player)) {
      this.speedY *= -1;
      this.y -= BOOST;
      if (player.leftKeyPressed) this.speedX = -SPEED;
      if (player.rightKeyPressed) this.speedX = SPEED;
    }
  }
}

class Game {
  constructor({
    ctx, header, scoreLabel, bestScoreLabel, score, bestScore, levelIndex,
    ball, player, bricks,
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

    return ball.belowPlayer(player);
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
            x: BRICK_X_OFFSET + x * BRICK_WIDTH,
            y: BRICK_Y_OFFSET + y * BRICK_HEIGHT,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          }));
        }
      }
    }

    this.player.setControls();
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
    ball.bounceOffCeilingIfHit();
    ball.bounceOffWallsIfHit();
    ball.bounceOffPlayerIfHit(player);
    player.move();
    ball.move();
    this.removeBrickIfHit();
    this.drawFrame();
    this.showGameStatus();
  }

  static generateRandomPosition() {
    const indent = 50;

    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (RIGHT_BORDER - 2 * indent) + indent;
  }

  getCurrentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }

  clearCanvas() {
    const startX = 0,
          startY = 0;

    this.ctx.clearRect(startX, startY, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawPlayer() {
    const { player } = this;
    player.draw(
      PLAYER_COLOR,
      player.x,
      player.y,
      player.width,
      player.height,
    );
  }

  drawBall() {
    const { ball } = this;
    ball.draw(BALL_COLOR, ball.x, ball.y, ball.r);
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

const main = () => {
  const canvas = document.querySelector('canvas'),
        canvasCtx = canvas.getContext('2d');

  const scoreLabelElement = document.getElementById('score'),
        bestScoreLabelElement = document.getElementById('bestScore'),
        headerElement = document.getElementById('header');

  const ball = new Ball({ ctx: canvasCtx, r: BALL_RADIUS }),
        player = new Player({
          ctx: canvasCtx,
          header: headerElement,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          speed: SPEED,
          ball,
        }),
        game = new Game({
          ctx: canvasCtx,
          header: headerElement,
          scoreLabel: scoreLabelElement,
          bestScoreLabel: bestScoreLabelElement,
          score: START_SCORE,
          bestScore: START_BEST_SCORE,
          levelIndex: START_LEVEL_INDEX,
          ball,
          player,
          bricks: START_BRICKS,
        });

  Object.assign(canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  game.init();
  setInterval(() => game.playGame(), DELAY);
};

main();
