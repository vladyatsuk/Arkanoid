import { START_CURRENT, START_BEST } from '../constants/score.js';

class ScoreState {
  currentScore = START_CURRENT;
  bestScore = START_BEST;

  get scores() {
    const { currentScore, bestScore } = this;

    return { currentScore, bestScore };
  }
}

export default ScoreState;
