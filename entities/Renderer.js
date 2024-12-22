import {
  START_X,
  START_Y,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../config/canvas.js';

const START_ANGLE = 0,
      // eslint-disable-next-line no-magic-numbers
      FULL_CIRCLE = 2 * Math.PI;

class Renderer {
  #ctx;
  #scoreLabel;
  #bestScoreLabel;
  #header;

  constructor(ctx, scoreLabel, bestScoreLabel, header) {
    this.#ctx = ctx;
    this.#scoreLabel = scoreLabel;
    this.#bestScoreLabel = bestScoreLabel;
    this.#header = header;
  }

  clearCanvas() {
    this.#ctx.clearRect(START_X, START_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawBall(ball) {
    const ctx = this.#ctx;
    ctx.save();
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, START_ANGLE, FULL_CIRCLE, false);
    ctx.fill();
    ctx.restore();
  }

  drawPlayer(player) {
    const ctx = this.#ctx;
    ctx.save();
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBrick(brick) {
    const ctx = this.#ctx;
    ctx.save();
    ctx.fillStyle = brick.color;
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brick.width, brick.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawBricks(bricks) {
    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active) {
        this.drawBrick(brick);
      }
    }
  }

  drawEntities({ ball, bricks, player }) {
    this.clearCanvas();
    this.drawBall(ball);
    this.drawBricks(bricks);
    this.drawPlayer(player);
  }

  drawScore(score) {
    this.#scoreLabel.innerHTML = `Score: ${score}`;
  }

  drawBestScore(bestScore) {
    this.#bestScoreLabel.innerHTML = `Best score: ${bestScore}`;
  }

  drawScores(score, bestScore) {
    this.drawScore(score);
    this.drawBestScore(bestScore);
  }

  drawHeader(message) {
    this.#header.innerHTML = message;
  }
}

export default Renderer;
