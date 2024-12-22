import { TOP_BORDER, RIGHT_BORDER, LEFT_BORDER } from '../config/canvas.js';

class CollisionDetector {
  static hitWalls(ball) {
    const hitLeftWall = ball.left + ball.speedX <= LEFT_BORDER,
          hitRightWall = ball.right + ball.speedX >= RIGHT_BORDER;

    return hitLeftWall || hitRightWall;
  }

  static hitCeiling(ball) {
    return ball.top + ball.speedY <= TOP_BORDER;
  }

  static hitPlayer(ball, player) {
    return (
      ball.top < player.bottom &&
      ball.right > player.left &&
      ball.bottom > player.top &&
      ball.left < player.right
    );
  }

  static hitBrick(ball, brick) {
    return (
      ball.top < brick.bottom &&
      ball.right > brick.left &&
      ball.bottom > brick.top &&
      ball.left < brick.right
    );
  }
}

export default CollisionDetector;
