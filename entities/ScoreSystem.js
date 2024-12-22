import { BASE_REWARD } from '../config/game.js';
import ScoreData from './ScoreData.js';

class ScoreSystem {
  #scoreData = new ScoreData();

  resetScore() {
    this.#scoreData.current = 0;
  }

  increaseScore(levelNumber) {
    this.#scoreData.current += BASE_REWARD * levelNumber;
  }

  updateBestScore() {
    const scoreData = this.#scoreData;
    const { current, best } = scoreData;

    if (current > best) scoreData.best = current;
  }

  get scores() {
    return this.#scoreData.scores;
  }
}

export default ScoreSystem;
