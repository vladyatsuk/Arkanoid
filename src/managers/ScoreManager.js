import { BASE_REWARD } from '../constants/score.js';

class ScoreManager {
  #scoreState;

  constructor(scoreState) {
    this.#scoreState = scoreState;
  }

  #updateBestScore() {
    const scoreState = this.#scoreState;
    const { currentScore, bestScore } = scoreState;

    if (currentScore > bestScore) {
      scoreState.bestScore = currentScore;
    }
  }

  resetScore() {
    this.#scoreState.currentScore = 0;
  }

  increaseScore(levelNumber) {
    const scoreState = this.#scoreState;

    scoreState.currentScore += BASE_REWARD * levelNumber;
    this.#updateBestScore();
  }
}

export default ScoreManager;
