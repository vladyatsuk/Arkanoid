class BrickManager {
  static remove(brick) {
    brick.active = false;
  }

  static isLevelDone(bricks) {
    return bricks.every((brick) => !brick.active);
  }
}

export default BrickManager;
