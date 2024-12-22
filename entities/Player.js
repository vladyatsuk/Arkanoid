import { CANVAS_LEFT, CANVAS_RIGHT } from '../constants/canvas.js';
import {
  PLAYER_WIDTH as WIDTH,
  PLAYER_HEIGHT as HEIGHT,
  PLAYER_COLOR as COLOR,
  PLAYER_SPEED as SPEED,
  PLAYER_START_X as START_X,
  PLAYER_START_Y as START_Y,
} from '../constants/player.js';

class Player {
  color;
  x;
  y;
  width;
  height;
  speed;
  leftKey = false;
  rightKey = false;
  canLaunchBall = true;

  constructor({
    color = COLOR,
    x = START_X,
    y = START_Y,
    width = WIDTH,
    height = HEIGHT,
    speed = SPEED,
  } = {}) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
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
      const leftmostPossiblePosition = CANVAS_LEFT;
      this.x = Math.max(leftmostPossiblePosition, this.x - this.speed);
    }

    if (this.rightKeyPressed) {
      const rightmostPossiblePosition = CANVAS_RIGHT - this.width;
      this.x = Math.min(rightmostPossiblePosition, this.x + this.speed);
    }

    return this.x;
  }
}

export default Player;
