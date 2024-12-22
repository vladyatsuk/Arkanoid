import { BASE_REWARD } from '../config/game.js';
import { START_SCORE, START_BEST_SCORE } from '../config/scores.js';

class ScoreManager {
  #current = START_SCORE;
  #best = START_BEST_SCORE;

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
