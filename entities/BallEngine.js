import { BALL_SPEED_X, BALL_SPEED_Y, BALL_START_Y } from '../constants/ball.js';
import { CANVAS_RIGHT } from '../constants/canvas.js';
import { GAME_INDENT } from '../constants/game.js';

class BallEngine {
  static launch(ball) {
    ball.speedX = BALL_SPEED_X;
    ball.speedY = BALL_SPEED_Y;
  }

  static stop(ball) {
    ball.speedX = 0;
    ball.speedY = 0;
  }

  static move(ball) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
  }

  static reverseSpeedY(ball) {
    ball.speedY *= -1;
  }

  static reverseSpeedX(ball) {
    ball.speedX *= -1;
  }

  static bounceX(ball, direction) {
    ball.speedX = direction * Math.abs(ball.speedX);
  }

  static resetPosition(ball) {
    // eslint-disable-next-line no-magic-numbers
    ball.x = Math.random() * (CANVAS_RIGHT - 2 * GAME_INDENT) + GAME_INDENT;
    ball.y = BALL_START_Y;
  }
}

export default BallEngine;
