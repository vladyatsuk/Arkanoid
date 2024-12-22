import { STATES, TRANSITIONS } from '../constants/gameState.js';

class GameState {
  #currentState = STATES.WAITING;

  get state() {
    return this.#currentState;
  }

  transition(newState) {
    if (!TRANSITIONS[this.#currentState].has(newState)) {
      throw new Error(`Impossible transition from '${this.#currentState}' to '${newState}'`);
    }

    this.#currentState = newState;
  }
}

export default GameState;
