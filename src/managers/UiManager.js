import { PHASES } from '../constants/gamePhase.js';

class UiManager {
  #gameLogicState;
  #uiState;

  constructor({ gameLogicState, uiState }) {
    this.#gameLogicState = gameLogicState;
    this.#uiState = uiState;
    this.updateScores();
  }

  updateScores() {
    const uiState = this.#uiState;
    const { currentScore, bestScore } = this.#gameLogicState.scoreState;

    uiState.currentScore = `${currentScore}`;
    uiState.bestScore = `${bestScore}`;
  }

  updateGameMessage() {
    const { gamePhaseState, levelState } = this.#gameLogicState;
    const uiState = this.#uiState;

    const messageMap = {
      [PHASES.PLAYING]: () => 'Break all the bricks!',
      [PHASES.LEVEL_DONE]: () => (levelState.isLastLevel
        ? 'You won the last level :)'
        : `You won level ${levelState.levelNumber} :)`),
      [PHASES.LOST]: () => 'You lost :(',
    };

    uiState.gameMessage = (
      messageMap[gamePhaseState.phase] ?? (() => 'ERROR')
    )();
  }
}

export default UiManager;
