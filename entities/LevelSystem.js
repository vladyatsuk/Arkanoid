import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../config/brick.js';

import Brick from './Brick.js';

import {
  COLORS,
  START_BRICKS,
  START_LEVEL_INDEX,
  LAST_LEVEL,
  LEVELS,
} from '../config/game.js';

class LevelSystem {
  levelIndex = START_LEVEL_INDEX;
  bricks = START_BRICKS;

  createBricks() {
    const level = LEVELS[this.levelIndex];
    this.bricks = START_BRICKS;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[0].length; x++) {
        if (level[y][x]) {
          this.bricks.push(new Brick({
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

  incrementLevelIndex() {
    this.levelIndex += 1;
  }

  resetLevelIndex() {
    this.levelIndex = 0;
  }

  get isLevelDone() {
    return this.bricks.every((brick) => !brick.active);
  }

  get isLastLevel() {
    return this.levelIndex === LAST_LEVEL;
  }

  get currentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }
}

export default LevelSystem;
