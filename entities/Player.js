import {
  RIGHT_BORDER,
  LEFT_BORDER,
} from '../config/canvas.js';

class Player {
  color;
  header;
  x;
  y;
  width;
  height;
  speed;
  ball;
  leftKey = false;
  rightKey = false;
  canLaunchBall = true;

  constructor({ color, header, x, y, width, height, speed, ball }) {
    this.color = color;
    this.header = header;
    this.x = x;
    this.y = y;
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
}

export default Player;
