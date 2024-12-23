class Brick {
  x;
  y;
  width;
  height;
  color;

  constructor({ x, y, width, height, color }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
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
}

export default Brick;
