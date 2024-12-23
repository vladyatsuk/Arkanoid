import { START_INDEX, LAST_INDEX, LEVELS } from '../constants/levels.js';

class LevelState {
  levelIndex = START_INDEX;

  get levelNumber() {
    return this.levelIndex + 1;
  }

  get levelStructure() {
    return LEVELS[this.levelIndex];
  }

  get isLastLevel() {
    return this.levelIndex === LAST_INDEX;
  }
}

export default LevelState;
