import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../config/brick.js';

import { COLORS } from '../config/game.js';

import Brick from './Brick.js';

class BrickManager {
  static createBricks(level) {
    const bricks = [];

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[0].length; x++) {
        if (level[y][x]) {
          bricks.push(new Brick({
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
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

  static removeBrick(brick) {
    brick.active = false;
  }

  static isLevelDone(bricks) {
    return bricks.every((brick) => !brick.active);
  }
}

export default BrickManager;
