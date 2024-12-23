import { PHASES } from '../constants/gamePhase.js';

class UiManager {
  #scoreState;
  #levelState;
  #gamePhaseState;
  #uiState;

  constructor({ scoreState, levelState, gamePhaseState, uiState }) {
    this.#scoreState = scoreState;
    this.#levelState = levelState;
    this.#gamePhaseState = gamePhaseState;
    this.#uiState = uiState;
    this.updateScores();
  }

  updateScores() {
    const uiState = this.#uiState;
    const { currentScore, bestScore } = this.#scoreState;

    uiState.currentScore = `${currentScore}`;
    uiState.bestScore = `${bestScore}`;
  }

  updateGameMessage() {
    const gamePhaseState = this.#gamePhaseState,
          levelState = this.#levelState,
          uiState = this.#uiState;

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
