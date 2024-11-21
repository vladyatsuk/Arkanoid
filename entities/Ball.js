import {
  TOP_BORDER,
  RIGHT_BORDER,
  LEFT_BORDER,
} from '../config/canvas.js';

import {
  BOOST,
  SPEED,
  START_ANGLE,
  FULL_CIRCLE,
} from '../config/ball.js';

class Ball {
  ctx;
  color;
  x;
  y;
  r;
  speedX = 0;
  speedY = 0;

  constructor({ ctx, color, x, y, r }) {
    this.ctx = ctx;
    this.color = color;
    this.x = x;
    this.y = y;
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

  draw() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, START_ANGLE, FULL_CIRCLE, false);
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

  bounceOffCeiling() {
    this.speedY *= -1;
    this.y += BOOST;
  }

  bounceOffWalls() {
    this.speedX *= -1;
  }

  bounceOffPlayer(player) {
    this.speedY *= -1;
    this.y -= BOOST;
    if (player.leftKeyPressed) this.speedX = -SPEED;
    if (player.rightKeyPressed) this.speedX = SPEED;
  }
}

export default Ball;
