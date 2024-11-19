const CANVAS_WIDTH = 600,
      CANVAS_HEIGHT = 600;

const DELAY = 1;

const START_ANGLE = 0,
      // eslint-disable-next-line no-magic-numbers
      FULL_CIRCLE = 2 * Math.PI;

const BALL_RADIUS = 10;

const PLAYER_WIDTH = 100,
      PLAYER_HEIGHT = 20;

const TOP_BORDER = 0,
      RIGHT_BORDER = CANVAS_WIDTH,
      BOTTOM_BORDER = CANVAS_HEIGHT,
      LEFT_BORDER = 0;

const BASE_REWARD = 100;

const SPEED = 1.5,
      BOOST = 5,
      INDENT = 50;

// eslint-disable-next-line no-magic-numbers
const CANVAS_HORIZONTAL_CENTER = CANVAS_WIDTH / 2,
      // eslint-disable-next-line no-magic-numbers
      CANVAS_VERTICAL_CENTER = CANVAS_HEIGHT / 2;

// eslint-disable-next-line no-magic-numbers
const START_PLAYER_POS_X_OFFSET = -(PLAYER_WIDTH / 2),
      START_PLAYER_POS_Y_OFFSET = -75,
      START_BALL_POS_Y_OFFSET = -15;

const START_PLAYER_POS_X = CANVAS_HORIZONTAL_CENTER + START_PLAYER_POS_X_OFFSET,
      START_PLAYER_POS_Y = BOTTOM_BORDER + START_PLAYER_POS_Y_OFFSET,
      START_BALL_POS_Y = START_PLAYER_POS_Y + START_BALL_POS_Y_OFFSET;

const START_BRICKS = [],
      START_SCORE = 0,
      START_BEST_SCORE = 0,
      START_LEVEL_INDEX = 0;

/* eslint-disable no-magic-numbers */
const LEVELS = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ],
];
/* eslint-enable no-magic-numbers */

const LAST_LEVEL = LEVELS.length;

const COLORS = [
  'silver',
  'maroon',
  'yellow',
  'purple',
  'lime',
  'navy',
  'teal',
  'aqua',
];

const PLAYER_COLOR = 'red';
const BALL_COLOR = 'red';

const clearCanvas = (ctx) => {
  const START_X = 0,
        START_Y = 0;

  ctx.clearRect(START_X, START_Y, CANVAS_WIDTH, CANVAS_HEIGHT);
};

class Brick {
  width;
  height;

  constructor(x, y, color) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = Brick.defaultWidth;
    this.height = Brick.defaultHeight;
  }

  draw(ctx, color, x, y, width, height) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  static defaultWidth = 50;
  static defaultHeight = 25;
  static defaultXOffset = 100;
  static defeaultYOffset = 100;
}

class Player {
  x = START_PLAYER_POS_X;
  y = START_PLAYER_POS_Y;
  leftKey = false;
  rightKey = false;
  canLaunchBall = true;

  constructor(ctx, header, width, height, speed, ball) {
    this.ctx = ctx;
    this.header = header;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.ball = ball;
  }

  draw(color, x, y, width, height) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  moveLeft() {
    if (this.leftKey) {
      const nextPosition = this.x - this.speed,
            leftmostPossiblePosition = LEFT_BORDER;

      this.x = Math.max(leftmostPossiblePosition, nextPosition);
    }

    return this.leftKey;
  }

  moveRight() {
    if (this.rightKey) {
      const nextPosition = this.x + this.speed,
            rightmostPossiblePosition = RIGHT_BORDER - this.width;

      this.x = Math.min(rightmostPossiblePosition, nextPosition);
    }

    return this.rightKey;
  }

  setControls() {
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = true;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      const { code } = event;

      if (code === 'KeyA' || code === 'ArrowLeft') {
        this.leftKey = false;
      }

      if (code === 'KeyD' || code === 'ArrowRight') {
        this.rightKey = false;
      }
    });
    document.addEventListener('keydown', (event) => {
      const { code } = event;

      if (code === 'KeyS' || code === 'ArrowDown') {
        if (this.canLaunchBall) {
          const { header, ball } = this;
          header.innerHTML = 'Break all the bricks!';
          ball.speedX = this.speed;
          ball.speedY = this.speed;
          this.canLaunchBall = false;
        }
      }
    });
  }
}

class Ball {
  x = CANVAS_HORIZONTAL_CENTER;
  y = CANVAS_VERTICAL_CENTER;
  speedX = 0;
  speedY = 0;

  constructor(ctx, r) {
    this.ctx = ctx;
    this.r = r;
  }

  draw(color, x, y, r) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, START_ANGLE, FULL_CIRCLE, false);
    ctx.fill();
    ctx.restore();
  }

  move() {
    this.x += this.speedX;
    this.y -= this.speedY;
  }
}

class Game {
  constructor(
    ctx, header, scoreLabel, bestScoreLabel, score, bestScore, levelIndex,
    ball, player, bricks,
  ) {
    this.ctx = ctx;
    this.header = header;
    this.scoreLabel = scoreLabel;
    this.bestScoreLabel = bestScoreLabel;
    this.score = score;
    this.bestScore = bestScore;
    this.levelIndex = levelIndex;
    this.ball = ball;
    this.player = player;
    this.bricks = bricks;
  }

  drawScore() {
    let { bestScore } = this;
    const { score, scoreLabel, bestScoreLabel } = this;

    if (score > bestScore) bestScore = score;
    scoreLabel.innerHTML = `Score: ${score}`;
    bestScoreLabel.innerHTML = `Best score: ${bestScore}`;
  }

  draw() {
    const { ball, player, bricks } = this;

    clearCanvas(this.ctx);
    ball.draw(BALL_COLOR, ball.x, ball.y, ball.r);

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];

      if (brick.active) {
        brick.draw(
          this.ctx,
          brick.color,
          brick.x,
          brick.y,
          brick.width,
          brick.height,
        );
      }
    }

    player.draw(
      PLAYER_COLOR,
      player.x,
      player.y,
      player.width,
      player.height,
    );

    this.drawScore();
  }

  isLoss() {
    const { ball, player } = this;

    const ballTop = ball.y - ball.r,
          playerBottom = player.y + player.height,
          hitFloor = ballTop > playerBottom;

    return hitFloor;
  }

  showGameStatus() {
    const { header, bricks } = this;

    if (this.score === BASE_REWARD * this.getCurrentLevel() * bricks.length) {
      this.score = 0;
      this.levelIndex += 1;
      header.innerHTML = `You won level ${this.levelIndex} :)`;

      if (this.levelIndex === LAST_LEVEL) {
        header.innerHTML = 'You won the last level :)';
        this.levelIndex = 0;
      }

      this.reset();
    }

    if (this.isLoss()) {
      this.levelIndex = 0;
      header.innerHTML = 'You lost :(';
      this.reset();
    }

    this.drawScore();
  }

  init() {
    const level = LEVELS[this.levelIndex];
    this.bricks = [];
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Game.generateRandomPosition();
    this.ball.y = START_BALL_POS_Y;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level.length; x++) {
        if (level[y][x]) {
          this.bricks.push(new Brick(
            Brick.defaultXOffset + x * Brick.defaultWidth,
            Brick.defeaultYOffset + y * Brick.defaultHeight,
            COLORS[Math.floor(Math.random() * COLORS.length)],
          ));
        }
      }
    }

    this.player.setControls();
  }

  reset() {
    const { ball, player } = this;
    this.score = 0;
    ball.speedX = 0;
    ball.speedY = 0;
    player.x = START_PLAYER_POS_X;
    player.canLaunchBall = true;
    ball.x = Game.generateRandomPosition();
    this.init();
  }

  bounceOffCeiling() {
    const { ball } = this;

    const ballTop = ball.y - ball.r,
          hitCeiling = ballTop + ball.speedY <= TOP_BORDER;

    if (hitCeiling) {
      ball.speedY *= -1;
      ball.y += BOOST;
    }
  }

  bounceOffWalls() {
    const { ball } = this;

    const ballLeft = ball.x - ball.r,
          ballRight = ball.x + ball.r;

    const hitLeftWall = ballLeft + ball.speedX <= LEFT_BORDER,
          hitRightWall = ballRight + ball.speedX >= RIGHT_BORDER;

    const hitWalls = hitLeftWall || hitRightWall;

    if (hitWalls) {
      if (ball.x < CANVAS_HORIZONTAL_CENTER) {
        ball.x += BOOST;
      } else {
        ball.x -= BOOST;
      }

      ball.speedX *= -1;
    }
  }

  bounceOffPlayer() {
    const { ball, player } = this;

    const ballCenter = ball.x,
          ballBottom = ball.y + ball.r;

    const playerTop = player.y,
          playerLeft = player.x,
          playerRight = player.x + player.width;

    const hitPlayer = ballBottom >= playerTop &&
      ballCenter >= playerLeft &&
      ballCenter <= playerRight;

    if (hitPlayer) {
      ball.speedY *= -1;
      ball.y -= BOOST;
      if (player.moveLeft()) ball.speedX = -SPEED;
      if (player.moveRight()) ball.speedX = SPEED;
    }
  }

  removeBrick() {
    const { ball, bricks } = this;

    const ballTop = ball.y - ball.r,
          ballRight = ball.x + ball.r,
          ballBottom = ball.y + ball.r,
          ballLeft = ball.x - ball.r;

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i],
            brickTop = brick.y,
            brickRight = brick.x + brick.width,
            brickBottom = brick.y + brick.height,
            brickLeft = brick.x;

      const isHitBrick = brickLeft < ballRight &&
        ballLeft < brickRight &&
        brickTop < ballBottom &&
        ballTop < brickBottom;

      if (brick.active && isHitBrick) {
        this.score += BASE_REWARD * this.getCurrentLevel();
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playgame() {
    const { ball, player } = this;

    if (player.canLaunchBall) player.x = START_PLAYER_POS_X;
    this.bounceOffCeiling();
    this.bounceOffWalls();
    this.bounceOffPlayer();
    player.moveLeft();
    player.moveRight();
    ball.move();
    this.removeBrick();
    this.draw();
    this.showGameStatus();
  }

  static generateRandomPosition() {
    // eslint-disable-next-line no-magic-numbers
    return Math.random() * (RIGHT_BORDER - 2 * INDENT) + INDENT;
  }

  getCurrentLevel() {
    // eslint-disable-next-line no-magic-numbers
    return this.levelIndex + 1;
  }
}

const canvas = document.querySelector('canvas'),
      canvasCtx = canvas.getContext('2d');

const scoreLabelElement = document.getElementById('score'),
      bestScoreLabelElement = document.getElementById('bestScore'),
      headerElement = document.getElementById('header');

const ball = new Ball(canvasCtx, BALL_RADIUS),
      player = new Player(
        canvasCtx,
        headerElement,
        PLAYER_WIDTH,
        PLAYER_HEIGHT,
        SPEED,
        ball,
      ),
      game = new Game(
        canvasCtx,
        headerElement,
        scoreLabelElement,
        bestScoreLabelElement,
        START_SCORE,
        START_BEST_SCORE,
        START_LEVEL_INDEX,
        ball,
        player,
        START_BRICKS,
      );

Object.assign(canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
game.init();
setInterval(() => game.playgame(), DELAY);
