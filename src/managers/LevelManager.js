class LevelManager {
  levelState;

  constructor(levelState) {
    this.levelState = levelState;
  }

  incrementLevelIndex() {
    this.levelState.levelIndex += 1;
  }

  resetLevelIndex() {
    this.levelState.levelIndex = 0;
  }
}

export default LevelManager;
