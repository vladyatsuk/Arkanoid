import {
  START_LEVEL_INDEX,
  LAST_LEVEL,
  LEVELS,
} from '../config/game.js';

class LevelManager {
  levelIndex = START_LEVEL_INDEX;

  incrementLevelIndex() {
    this.levelIndex += 1;
  }

  resetLevelIndex() {
    this.levelIndex = 0;
  }

  get isLastLevel() {
    return this.levelIndex === LAST_LEVEL;
  }

  get currentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }

  get levelStructure() {
    return LEVELS[this.levelIndex];
  }
}

export default LevelManager;
