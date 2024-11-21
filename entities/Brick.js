class Brick {
  color;
  x;
  y;
  width;
  height;
  active = true;

  constructor({ color, x, y, width, height }) {
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
}

export default Brick;
