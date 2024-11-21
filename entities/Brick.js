class Brick {
  ctx;
  color;
  x;
  y;
  width;
  height;
  active = true;

  constructor({ ctx, color, x, y, width, height }) {
    this.ctx = ctx;
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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

  draw() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export default Brick;
