import { GAME_DELAY } from './constants/game.js';

import EntityFactory from './factories/EntityFactory.js';

import Controls from './input/Controls.js';
import UiState from './state/UiState.js';
import UiManager from './managers/UiManager.js';
import GameLogicState from './state/GameLogicState.js';
import GameLogicManager from './managers/GameLogicManager.js';
import GamePhaseHandler from './GamePhaseHandler.js';

class Game {
  #renderer;
  #uiState;
  #gamePhaseHandler;
  #entities;

  constructor(renderer) {
    this.#renderer = renderer;
    const gameLogicState = new GameLogicState(),
          gameLogicManager = new GameLogicManager(gameLogicState),
          uiState = new UiState(),
          uiManager = new UiManager({ gameLogicState, uiState }),
          entities = EntityFactory
            .createEntities(gameLogicState.levelStructure),
          controls = new Controls();

    this.#entities = entities;
    this.#uiState = uiState;

    this.#gamePhaseHandler = new GamePhaseHandler({
      gameLogicState,
      gameLogicManager,
      uiManager,
      entities,
      controls,
    });
  }

  #loop() {
    this.#gamePhaseHandler.currentHandler();
    this.#renderer.drawFrame(this.#entities, this.#uiState);
  }

  start() {
    setInterval(() => this.#loop(), GAME_DELAY);
  }
}

export default Game;
