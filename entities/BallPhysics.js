import {
  BOOST,
  SPEED,
} from '../config/ball.js';

class BallPhysics {
  static bounceOffCeiling(ball) {
    ball.speedY *= -1;
    ball.y += BOOST;
  }

  static bounceOffWalls(ball) {
    ball.speedX *= -1;
  }

  static bounceOffPlayer(ball, player) {
    ball.speedY *= -1;
    ball.y -= BOOST;
    if (player.leftKeyPressed) ball.speedX = -SPEED;
    if (player.rightKeyPressed) ball.speedX = SPEED;
  }
}

export default BallPhysics;
