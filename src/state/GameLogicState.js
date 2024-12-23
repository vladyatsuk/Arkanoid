import GamePhaseState from './GamePhaseState.js';
import LevelState from './LevelState.js';
import ScoreState from './ScoreState.js';

class GameLogicState {
  levelState;
  scoreState;
  gamePhaseState;

  constructor() {
    this.levelState = new LevelState();
    this.scoreState = new ScoreState();
    this.gamePhaseState = new GamePhaseState();
  }

  get phase() {
    return this.gamePhaseState.phase;
  }

  get levelNumber() {
    return this.levelState.levelNumber;
  }

  get isLastLevel() {
    return this.levelState.isLastLevel;
  }

  get levelStructure() {
    return this.levelState.levelStructure;
  }
}

export default GameLogicState;
