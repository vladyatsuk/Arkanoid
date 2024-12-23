import { COMMANDS, COMMANDS_TO_CODES } from '../constants/commands.js';

class Controls {
  #commandStates = Object.keys(COMMANDS)
    .reduce((states, command) => {
      states[command] = false;

      return states;
    }, {});

  constructor() {
    this.#setupEventListeners();
  }

  #set(code, isActive) {
    for (const [command, codes] of Object.entries(COMMANDS_TO_CODES)) {
      if (codes.has(code)) {
        this.#commandStates[command] = isActive;
      }
    }
  }

  #handleKeyDown(event) {
    this.#set(event.code, true);
  }

  #handleKeyUp(event) {
    this.#set(event.code, false);
  }

  #setupEventListeners() {
    document.addEventListener('keydown', (event) => {
      this.#handleKeyDown(event);
    });
    document.addEventListener('keyup', (event) => {
      this.#handleKeyUp(event);
    });
  }

  isActive(command) {
    return this.#commandStates[command];
  }
}

export default Controls;
