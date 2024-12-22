import { CANVAS_LEFT, CANVAS_RIGHT } from '../constants/canvas.js';
import Controls from './Controls.js';

class Mover {
  static movePlayer(player) {
    if (Controls.leftKey) {
      player.x = Math.max(CANVAS_LEFT, player.x - player.speed);
    }

    if (Controls.rightKey) {
      player.x = Math.min(CANVAS_RIGHT - player.width, player.x + player.speed);
    }
  }

  static moveBall(ball) {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
  }
}

export default Mover;
