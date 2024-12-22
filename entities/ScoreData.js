import { START_SCORE, START_BEST_SCORE } from '../config/scores.js';

class ScoreData {
  current = START_SCORE;
  best = START_BEST_SCORE;

  get scores() {
    const { current, best } = this;

    return { current, best };
  }
}

export default ScoreData;
