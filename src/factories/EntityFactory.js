import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../constants/brick.js';
import { GAME_COLORS } from '../constants/game.js';
import Brick from '../entities/Brick.js';

class EntityFactory {
  static createBricks(level) {
    const bricks = new Set();

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[0].length; x++) {
        if (level[y][x]) {
          bricks.add(new Brick({
            color: GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)],
            x: BRICK_X_OFFSET + x * BRICK_WIDTH,
            y: BRICK_Y_OFFSET + y * BRICK_HEIGHT,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
          }));
        }
      }
    }

    return bricks;
  }
}

export default EntityFactory;
