import { START_CURRENT, START_BEST, BASE_REWARD } from '../constants/score.js';

class ScoreManager {
  #current = START_CURRENT;
  #best = START_BEST;

  get scores() {
    return { current: this.#current, best: this.#best };
  }

  resetScore() {
    this.#current = 0;
  }

  increaseScore(levelNumber) {
    this.#current += BASE_REWARD * levelNumber;
  }

  updateBestScore() {
    const { current, best } = this.scores;

    if (current > best) this.#best = current;
  }
}

export default ScoreManager;
