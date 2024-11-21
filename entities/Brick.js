import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
} from '../config/brick.js';

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

export default Brick;
