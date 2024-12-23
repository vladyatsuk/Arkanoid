import {
  PLAYER_LEFT_DIRECTION,
  PLAYER_RIGHT_DIRECTION,
} from './constants/player.js';
import {
  BALL_LEFT_DIRECTION,
  BALL_RIGHT_DIRECTION,
} from './constants/ball.js';

import { COMMANDS } from './constants/commands.js';
import { PHASES } from './constants/gamePhase.js';

import CollisionDetector from './physics/CollisionDetector.js';
import PlayerEngine from './physics/PlayerEngine.js';
import BallEngine from './physics/BallEngine.js';
import EntityFactory from './factories/EntityFactory.js';

class GamePhaseHandler {
  #gameLogicState;
  #gameLogicManager;
  #uiManager;
  #entities;
  #controls;

  constructor({
    gameLogicState,
    gameLogicManager,
    uiManager,
    entities,
    controls,
  }) {
    this.#gameLogicState = gameLogicState;
    this.#gameLogicManager = gameLogicManager;
    this.#uiManager = uiManager;
    this.#entities = entities;
    this.#controls = controls;
    this.#resetPositions();
  }

  get #isLoss() {
    const { ball, player } = this.#entities;

    return ball.top > player.bottom;
  }

  #handlePlayerMovement() {
    const { player } = this.#entities;

    if (this.#controls.isActive(COMMANDS.MOVE_LEFT)) {
      PlayerEngine.move(player, PLAYER_LEFT_DIRECTION);
    }

    if (this.#controls.isActive(COMMANDS.MOVE_RIGHT)) {
      PlayerEngine.move(player, PLAYER_RIGHT_DIRECTION);
    }
  }

  #handleCollisions() {
    const { ball, player, bricks } = this.#entities;
    const { levelNumber } = this.#gameLogicState;

    if (CollisionDetector.hitCeiling(ball)) {
      BallEngine.reverseSpeedY(ball);
    }

    if (CollisionDetector.hitWalls(ball)) {
      BallEngine.reverseSpeedX(ball);
    }

    if (CollisionDetector.hitPlayer(ball, player)) {
      if (this.#controls.isActive(COMMANDS.MOVE_LEFT)) {
        BallEngine.bounceX(ball, BALL_LEFT_DIRECTION);
      }

      if (this.#controls.isActive(COMMANDS.MOVE_RIGHT)) {
        BallEngine.bounceX(ball, BALL_RIGHT_DIRECTION);
      }

      BallEngine.reverseSpeedY(ball);
    }

    for (const brick of bricks) {
      if (CollisionDetector.hitBrick(ball, brick)) {
        this.#gameLogicManager.increaseScore(levelNumber);
        this.#uiManager.updateScores();
        bricks.delete(brick);
        BallEngine.reverseSpeedY(ball);
        break;
      }
    }
  }

  #resetPositions() {
    const { ball, player } = this.#entities;
    BallEngine.stop(ball);
    BallEngine.resetPosition(ball);
    PlayerEngine.resetPosition(player);
  }

  #createLevel() {
    const { levelStructure } = this.#gameLogicState;
    this.#entities.bricks = EntityFactory.createBricks(levelStructure);
  }

  #handleWaiting() {
    const { ball } = this.#entities;

    if (this.#controls.isActive(COMMANDS.LAUNCH_BALL)) {
      BallEngine.launch(ball);
      this.#gameLogicManager.transition(PHASES.PLAYING);
    }
  }

  #handlePlaying() {
    const { ball, bricks } = this.#entities;

    this.#uiManager.updateGameMessage();

    this.#handleCollisions();
    this.#handlePlayerMovement();

    BallEngine.move(ball);

    if (!bricks.size) {
      this.#gameLogicManager.transition(PHASES.LEVEL_DONE);
    } else if (this.#isLoss) {
      this.#gameLogicManager.transition(PHASES.LOST);
    }
  }

  #handleLevelDone() {
    const gameLogicState = this.#gameLogicState;
    this.#uiManager.updateGameMessage();
    this.#gameLogicManager.incrementLevelIndex();

    if (gameLogicState.isLastLevel) {
      this.#uiManager.updateGameMessage();
      this.#gameLogicManager.resetLevelIndex();
    }

    this.#createLevel();
    this.#resetPositions();
    this.#gameLogicManager.transition(PHASES.WAITING);
  }

  #handleLost() {
    this.#gameLogicManager.resetLevelIndex();
    this.#gameLogicManager.resetScore();
    this.#uiManager.updateGameMessage();
    this.#uiManager.updateScores();
    this.#createLevel();
    this.#resetPositions();
    this.#gameLogicManager.transition(PHASES.WAITING);
  }

  get currentHandler() {
    const { phase } = this.#gameLogicState;

    const handlerMap = {
      [PHASES.WAITING]: () => {
        this.#handleWaiting();
      },
      [PHASES.PLAYING]: () => {
        this.#handlePlaying();
      },
      [PHASES.LEVEL_DONE]: () => {
        this.#handleLevelDone();
      },
      [PHASES.LOST]: () => {
        this.#handleLost();
      },
    };

    const handler = handlerMap[phase];

    if (!handler) {
      throw new Error(`Unhandled state: ${phase}`);
    }

    return handlerMap[phase];
  }
}

export default GamePhaseHandler;
