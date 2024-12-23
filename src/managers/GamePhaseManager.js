import { TRANSITIONS } from '../constants/gamePhase.js';

class GamePhaseManager {
  #gamePhaseState;

  constructor(gamePhaseState) {
    this.#gamePhaseState = gamePhaseState;
  }

  transition(newPhase) {
    const { phase } = this.#gamePhaseState;

    if (!TRANSITIONS[phase].has(newPhase)) {
      throw new Error(`Impossible transition from '${phase}' to '${newPhase}'`);
    }

    this.#gamePhaseState.phase = newPhase;
  }
}

export default GamePhaseManager;
