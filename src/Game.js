import {
  PLAYER_LEFT_DIRECTION,
  PLAYER_RIGHT_DIRECTION,
} from './constants/player.js';
import {
  BALL_LEFT_DIRECTION,
  BALL_RIGHT_DIRECTION,
} from './constants/ball.js';
import { GAME_DELAY } from './constants/game.js';
import { PHASES } from './constants/gamePhase.js';
import { COMMANDS } from './constants/commands.js';

import PlayerEngine from './physics/PlayerEngine.js';
import CollisionDetector from './physics/CollisionDetector.js';
import Controls from './input/Controls.js';
import BallEngine from './physics/BallEngine.js';
import EntityFactory from './factories/EntityFactory.js';

import GamePhaseState from './state/GamePhaseState.js';
import LevelState from './state/LevelState.js';
import ScoreState from './state/ScoreState.js';
import UiState from './state/UiState.js';

import GamePhaseManager from './managers/GamePhaseManager.js';
import LevelManager from './managers/LevelManager.js';
import ScoreManager from './managers/ScoreManager.js';
import UiManager from './managers/UiManager.js';

class Game {
  #levelState;
  #levelManager;
  #scoreState;
  #scoreManager;
  #gamePhaseState;
  #gamePhaseManager;
  #uiState;
  #uiManager;
  #entities;
  #controls;
  #renderer;

  constructor(renderer) {
    this.#renderer = renderer;

    this.#uiState = new UiState();
    this.#levelState = new LevelState();
    this.#scoreState = new ScoreState();
    this.#gamePhaseState = new GamePhaseState();

    this.#uiManager = new UiManager({
      scoreState: this.#scoreState,
      levelState: this.#levelState,
      gamePhaseState: this.#gamePhaseState,
      uiState: this.#uiState,
    });
    this.#gamePhaseManager = new GamePhaseManager(this.#gamePhaseState);
    this.#scoreManager = new ScoreManager(this.#scoreState);
    this.#levelManager = new LevelManager(this.#levelState);

    this.#entities = EntityFactory
      .createEntities(this.#levelState.levelStructure);
    this.#controls = new Controls();

    this.#resetPositions();
  }

  get #isLoss() {
    const { ball, player } = this.#entities;

    return ball.top > player.bottom;
  }

  #handleWaiting() {
    const { ball } = this.#entities;

    const gamePhaseManager = this.#gamePhaseManager,
          controls = this.#controls;

    if (controls.isActive(COMMANDS.LAUNCH_BALL)) {
      BallEngine.launch(ball);
      gamePhaseManager.transition(PHASES.PLAYING);
    }
  }

  #handlePlaying() {
    const { ball, player, bricks } = this.#entities;

    const scoreManager = this.#scoreManager,
          gamePhaseManager = this.#gamePhaseManager,
          uiManager = this.#uiManager,
          levelState = this.#levelState,
          controls = this.#controls;

    uiManager.updateGameMessage();

    if (CollisionDetector.hitCeiling(ball)) {
      BallEngine.reverseSpeedY(ball);
    }

    if (CollisionDetector.hitWalls(ball)) {
      BallEngine.reverseSpeedX(ball);
    }

    if (CollisionDetector.hitPlayer(ball, player)) {
      if (controls.isActive(COMMANDS.MOVE_LEFT)) {
        BallEngine.bounceX(ball, BALL_LEFT_DIRECTION);
      }

      if (controls.isActive(COMMANDS.MOVE_RIGHT)) {
        BallEngine.bounceX(ball, BALL_RIGHT_DIRECTION);
      }

      BallEngine.reverseSpeedY(ball);
    }

    for (const brick of bricks) {
      if (CollisionDetector.hitBrick(ball, brick)) {
        scoreManager.increaseScore(levelState.levelNumber);
        uiManager.updateScores();
        bricks.delete(brick);
        BallEngine.reverseSpeedY(ball);
        break;
      }
    }

    if (controls.isActive(COMMANDS.MOVE_LEFT)) {
      PlayerEngine.move(player, PLAYER_LEFT_DIRECTION);
    }

    if (controls.isActive(COMMANDS.MOVE_RIGHT)) {
      PlayerEngine.move(player, PLAYER_RIGHT_DIRECTION);
    }

    BallEngine.move(ball);

    if (!bricks.size) {
      gamePhaseManager.transition(PHASES.LEVEL_DONE);
    } else if (this.#isLoss) {
      gamePhaseManager.transition(PHASES.LOST);
    }
  }

  #handleLevelDone() {
    const uiManager = this.#uiManager,
          levelManager = this.#levelManager,
          gamePhaseManager = this.#gamePhaseManager,
          levelState = this.#levelState;

    uiManager.updateGameMessage();

    levelManager.incrementLevelIndex();

    if (levelState.isLastLevel) {
      uiManager.updateGameMessage();
      levelManager.resetLevelIndex();
    }

    this.#createLevel();
    gamePhaseManager.transition(PHASES.WAITING);
  }

  #handleLost() {
    const uiManager = this.#uiManager,
          levelManager = this.#levelManager,
          scoreManager = this.#scoreManager,
          gamePhaseManager = this.#gamePhaseManager;

    levelManager.resetLevelIndex();
    uiManager.updateGameMessage();
    scoreManager.resetScore();
    uiManager.updateScores();
    this.#createLevel();
    gamePhaseManager.transition(PHASES.WAITING);
  }

  #resetPositions() {
    const entities = this.#entities;

    BallEngine.stop(entities.ball);
    BallEngine.resetPosition(entities.ball);
    PlayerEngine.resetPosition(entities.player);
  }

  #createLevel() {
    const entities = this.#entities,
          levelState = this.#levelState;

    this.#resetPositions();
    entities.bricks = EntityFactory.createBricks(levelState.levelStructure);
  }

  #loop() {
    const renderer = this.#renderer,
          gamePhaseState = this.#gamePhaseState,
          uiState = this.#uiState,
          entities = this.#entities;

    const handler = {
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
    }[gamePhaseState.phase];

    if (!handler) {
      throw new Error(`Unhandled state: ${gamePhaseState.phase}`);
    }

    handler();
    renderer.drawFrame(entities, uiState);
  }

  start() {
    setInterval(() => this.#loop(), GAME_DELAY);
  }
}

export default Game;
