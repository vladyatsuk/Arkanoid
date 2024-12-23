import { START_INDEX, LAST_INDEX, LEVELS } from '../constants/levels.js';

class LevelManager {
  levelIndex = START_INDEX;

  incrementLevelIndex() {
    this.levelIndex += 1;
  }

  resetLevelIndex() {
    this.levelIndex = 0;
  }

  get isLastLevel() {
    return this.levelIndex === LAST_INDEX;
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
