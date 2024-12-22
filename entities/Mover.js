import { LEFT_BORDER, RIGHT_BORDER } from '../config/canvas.js';

class Mover {
  static movePlayer(player) {
    if (player.leftKeyPressed) {
      player.x = Math.max(LEFT_BORDER, player.x - player.speed);
    }

    if (player.rightKeyPressed) {
      player.x = Math.min(RIGHT_BORDER - player.width, player.x + player.speed);
    }
  }

  static moveBall(ball) {
    ball.x += ball.speedX;
    ball.y -= ball.speedY;
  }
}

export default Mover;
