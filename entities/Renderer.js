import {
  CANVAS_WIDTH as WIDTH,
  CANVAS_HEIGHT as HEIGHT,
  CANVAS_START_X as START_X,
  CANVAS_START_Y as START_Y,
} from '../constants/canvas.js';

const START_ANGLE = 0,
      // eslint-disable-next-line no-magic-numbers
      FULL_CIRCLE = 2 * Math.PI;

class Renderer {
  #ctx;
  #currentScoreElement;
  #bestScoreElement;
  #gameMessageElement;

  constructor({
    ctx,
    currentScoreElement,
    bestScoreElement,
    gameMessageElement,
  }) {
    this.#ctx = ctx;
    this.#currentScoreElement = currentScoreElement;
    this.#bestScoreElement = bestScoreElement;
    this.#gameMessageElement = gameMessageElement;
  }

  clearCanvas() {
    this.#ctx.clearRect(START_X, START_Y, WIDTH, HEIGHT);
  }

  drawBall(ball) {
    const ctx = this.#ctx;
    const { color, x, y, r } = ball;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, START_ANGLE, FULL_CIRCLE, false);
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(player) {
    const ctx = this.#ctx;
    const { color, x, y, width, height } = player;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBrick(brick) {
    const ctx = this.#ctx;
    const { color, x, y, width, height } = brick;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBricks(bricks) {
    for (const brick of bricks) {
      this.drawBrick(brick);
    }
  }

  drawEntities({ ball, bricks, player }) {
    this.clearCanvas();
    this.drawBall(ball);
    this.drawBricks(bricks);
    this.drawPlayer(player);
  }

  drawScore(score) {
    this.#currentScoreElement.textContent = `${score}`;
  }

  drawBestScore(bestScore) {
    this.#bestScoreElement.textContent = `${bestScore}`;
  }

  drawScores({ current, best }) {
    this.drawScore(current);
    this.drawBestScore(best);
  }

  drawGameMessage(message) {
    this.#gameMessageElement.textContent = message;
  }
}

export default Renderer;
