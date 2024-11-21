import {
  CANVAS_HORIZONTAL_CENTER,
  CANVAS_VERTICAL_CENTER,
  TOP_BORDER,
  RIGHT_BORDER,
  LEFT_BORDER,
} from '../config/canvas.js';

import {
  BOOST,
  SPEED,
} from '../config/ball.js';

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

export default Ball;
