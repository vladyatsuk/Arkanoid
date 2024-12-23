import GamePhaseManager from './GamePhaseManager.js';
import LevelManager from './LevelManager.js';
import ScoreManager from './ScoreManager.js';

class GameLogicManager {
  levelManager;
  scoreManager;
  gamePhaseManager;

  constructor(gameLogicState) {
    const { levelState, scoreState, gamePhaseState } = gameLogicState;
    this.levelManager = new LevelManager(levelState);
    this.scoreManager = new ScoreManager(scoreState);
    this.gamePhaseManager = new GamePhaseManager(gamePhaseState);
  }

  incrementLevelIndex() {
    this.levelManager.incrementLevelIndex();
  }

  resetLevelIndex() {
    this.levelManager.resetLevelIndex();
  }

  increaseScore(levelNumber) {
    this.scoreManager.increaseScore(levelNumber);
  }

  resetScore() {
    this.scoreManager.resetScore();
  }

  transition(newPhase) {
    this.gamePhaseManager.transition(newPhase);
  }
}

export default GameLogicManager;
