import { CANVAS_LEFT, CANVAS_RIGHT } from '../constants/canvas.js';
import { PLAYER_START_X } from '../constants/player.js';

class PlayerEngine {
  static move(player, direction) {
    player.x = Math.max(
      CANVAS_LEFT,
      Math.min(
        CANVAS_RIGHT - player.width,
        player.x + direction * player.speed,
      ),
    );
  }

  static resetPosition(player) {
    player.x = PLAYER_START_X;
  }
}

export default PlayerEngine;
