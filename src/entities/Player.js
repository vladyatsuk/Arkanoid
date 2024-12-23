class Player {
  x;
  y;
  width;
  height;
  speed;
  color;

  constructor({
    x,
    y,
    width,
    height,
    speed,
    color,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
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

export default Player;
