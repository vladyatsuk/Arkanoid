import { BALL_SPEED_X, BALL_SPEED_Y } from '../constants/ball.js';
import { STATES } from '../constants/gameState.js';

class Controls {
  static leftKey = false;
  static rightKey = false;

  static #handleKeyDown(event) {
    const { code } = event;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      this.leftKey = true;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      this.rightKey = true;
    }
  }

  static #handleKeyUp(event) {
    const { code } = event;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      this.leftKey = false;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      this.rightKey = false;
    }
  }

  static #handleGameStartOnKeys(event, ball, gameState) {
    const { code } = event;

    if (code === 'KeyS' || code === 'ArrowDown') {
      if (gameState.state === STATES.WAITING) {
        ball.speedX = BALL_SPEED_X;
        ball.speedY = BALL_SPEED_Y;
        gameState.transition(STATES.PLAYING);
      }
    }
  }

  static setControls(ball, gameState) {
    document.addEventListener('keydown', (event) => {
      this.#handleKeyDown(event);
      this.#handleGameStartOnKeys(event, ball, gameState);
    });
    document.addEventListener('keyup', (event) => {
      this.#handleKeyUp(event);
    });
  }
}

export default Controls;
