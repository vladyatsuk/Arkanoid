import { LEVELS, COLORS } from '../config/game.js';
import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../config/brick.js';
import Brick from './Brick.js';

class LevelManager {
  static initLevel(levelData) {
    levelData.bricks = [];
    const level = LEVELS[levelData.levelIndex];

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[0].length; x++) {
        if (level[y][x]) {
          levelData.bricks.push(new Brick({
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            x: BRICK_X_OFFSET + x * BRICK_WIDTH,
            y: BRICK_Y_OFFSET + y * BRICK_HEIGHT,
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
          }));
        }
      }
    }
  }

  static incrementLevelIndex(levelData) {
    levelData.levelIndex += 1;
  }

  static resetLevelIndex(levelData) {
    levelData.levelIndex = 0;
  }
}

export default LevelManager;
