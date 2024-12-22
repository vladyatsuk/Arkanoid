class Ball {
  color;
  x;
  y;
  r;
  speedX = 0;
  speedY = 0;

  constructor({ color, x, y, r }) {
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
}

export default Ball;
