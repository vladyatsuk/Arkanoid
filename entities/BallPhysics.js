import { BALL_BOOST, BALL_SPEED_X } from '../constants/ball.js';

class BallPhysics {
  static bounceOffCeiling(ball) {
    ball.speedY *= -1;
    ball.y += BALL_BOOST;
  }

  static bounceOffWalls(ball) {
    ball.speedX *= -1;
  }

  static bounceOffPlayer(ball, player) {
    ball.speedY *= -1;
    ball.y -= BALL_BOOST;
    if (player.leftKeyPressed) ball.speedX = -BALL_SPEED_X;
    if (player.rightKeyPressed) ball.speedX = BALL_SPEED_X;
  }

  static bounceOffBrick(ball) {
    ball.speedY *= -1;
  }
}

export default BallPhysics;
