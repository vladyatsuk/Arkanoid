class UiState {
  currentScore;
  bestScore;
  gameMessage;

  constructor() {
    this.currentScore = '';
    this.bestScore = '';
    this.gameMessage = 'Press \'s\' to play!';
  }
}

export default UiState;
