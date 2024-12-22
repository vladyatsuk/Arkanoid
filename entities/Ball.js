import {
  BOOST,
  SPEED,
} from '../config/ball.js';

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

  bounceOffCeiling() {
    this.speedY *= -1;
    this.y += BOOST;
  }

  bounceOffWalls() {
    this.speedX *= -1;
  }

  bounceOffPlayer(player) {
    this.speedY *= -1;
    this.y -= BOOST;
    if (player.leftKeyPressed) this.speedX = -SPEED;
    if (player.rightKeyPressed) this.speedX = SPEED;
  }
}

export default Ball;
