import { CANVAS_TOP, CANVAS_RIGHT, CANVAS_LEFT } from '../constants/canvas.js';

class CollisionDetector {
  static hitWalls(ball) {
    const hitLeftWall = ball.left + ball.speedX <= CANVAS_LEFT,
          hitRightWall = ball.right + ball.speedX >= CANVAS_RIGHT;

    return hitLeftWall || hitRightWall;
  }

  static hitCeiling(ball) {
    return ball.top + ball.speedY <= CANVAS_TOP;
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
