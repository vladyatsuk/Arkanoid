import { CANVAS_CENTER_X } from '../constants/canvas.js';
import {
  BALL_START_Y,
  BALL_COLOR as COLOR,
  BALL_RADIUS as RADIUS,
} from '../constants/ball.js';

class Ball {
  x;
  y;
  r;
  speedX = 0;
  speedY = 0;
  color;

  constructor({
    x = CANVAS_CENTER_X,
    y = BALL_START_Y,
    r = RADIUS,
    color = COLOR,
  } = {}) {
    this.x = x;
    this.y = y;
    this.r = r;
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
