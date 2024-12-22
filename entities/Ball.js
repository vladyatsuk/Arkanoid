import { CANVAS_CENTER_X, CANVAS_CENTER_Y } from '../constants/canvas.js';
import {
  BALL_COLOR as COLOR,
  BALL_RADIUS as RADIUS,
} from '../constants/ball.js';

class Ball {
  color;
  x;
  y;
  r;
  speedX = 0;
  speedY = 0;

  constructor({
    color = COLOR,
    x = CANVAS_CENTER_X,
    y = CANVAS_CENTER_Y,
    r = RADIUS,
  } = {}) {
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
