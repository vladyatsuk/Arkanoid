class Ball {
  x;
  y;
  r;
  speedX;
  speedY;
  color;

  constructor({ x, y, r, speedX, speedY, color }) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = color;
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
