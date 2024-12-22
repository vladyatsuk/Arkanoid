import { LAST_LEVEL, START_BRICKS, START_LEVEL_INDEX } from '../config/game.js';

class LevelData {
  levelIndex = START_LEVEL_INDEX;
  bricks = START_BRICKS;

  get isLevelDone() {
    const { bricks } = this;

    return bricks.every((brick) => !brick.active);
  }

  get isLastLevel() {
    return this.levelIndex === LAST_LEVEL;
  }

  get currentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }
}

export default LevelData;
