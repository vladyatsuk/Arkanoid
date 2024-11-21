import {
  RIGHT_BORDER,
  LEFT_BORDER,
} from '../config/canvas.js';

class Player {
  ctx;
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

  constructor({ ctx, color, header, x, y, width, height, speed, ball }) {
    this.ctx = ctx;
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

  draw() {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
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

  setControls() {
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = true;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = false;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = false;
      }
    });
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyS' || code === 'ArrowDown') {
        if (this.canLaunchBall) {
          const { header, ball } = this;
          header.innerHTML = 'Break all the bricks!';
          ball.speedX = this.speed;
          ball.speedY = this.speed;
          this.canLaunchBall = false;
        }
      }
    });
  }
}

export default Player;
