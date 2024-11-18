const canvas = document.querySelector('canvas'),
      canvasCtx = canvas.getContext('2d');

const scoreLabelElement = document.getElementById('score'),
      bestScoreLabelElement = document.getElementById('bestScore'),
      headerElement = document.getElementById('header');

Object.assign(canvas, { width: 600, height: 600 });

const SPEED = 1.5,
      BOOST = 5,
      INDENT = 50,
      BRICK_PARAMETERS = {
        width: 50,
        height: 25,
      };

const START_PLAYER_POS_X = canvas.width / 2 - 50,
      START_PLAYER_POS_Y = canvas.height - 75,
      START_BALL_POS_Y = START_PLAYER_POS_Y - 15;

const START_BRICKS = [],
      START_SCORE = 0,
      START_BEST_SCORE = 0,
      START_LEVEL_INDEX = 0;

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

class Brick {
  width = 50;
  height = 25;

  constructor(x, y, color) {
    this.active = true;
    this.x = x;
    this.y = y;
    this.color = color;
  }
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
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
  }

  moveLeft() {
    if (this.leftKey) {
      this.x = Math.max(0, this.x - this.speed);
    }

    return this.leftKey;
  }

  moveRight() {
    if (this.rightKey) {
      this.x = Math.min(canvas.width - this.width, this.x + this.speed);
    }

    return this.rightKey;
  }

  setControls() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        this.leftKey = true;
      }

      if (event.code === 'KeyD' || event.code === 'ArrowRight') {
        this.rightKey = true;
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        this.leftKey = false;
      }

      if (event.code === 'KeyD' || event.code === 'ArrowRight') {
        this.rightKey = false;
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyS' || event.key === 'ArrowDown') {
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
  x = canvas.width / 2;
  y = canvas.width / 2;
  speedX = 0;
  speedY = 0;

  constructor(ctx, r) {
    this.ctx = ctx;
    this.r = r;
  }

  draw(color, x, y, r) {
    const { ctx } = this;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  move() {
    this.x += this.speedX;
    this.y -= this.speedY;
  }
}

class Game {
  constructor(
    header, scoreLabel, bestScoreLabel, score, bestScore, levelIndex,
    ball, player, brickParameters, bricks,
  ) {
    this.header = header;
    this.scoreLabel = scoreLabel;
    this.bestScoreLabel = bestScoreLabel;
    this.score = score;
    this.bestScore = bestScore;
    this.levelIndex = levelIndex;
    this.ball = ball;
    this.player = player;
    this.brickParameters = brickParameters;
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
    player.draw('white', 0, 0, canvas.width, canvas.height);
    ball.draw('red', ball.x, ball.y, ball.r);

    for (let i = 0; i < bricks.length; i++) {
      const brick = bricks[i];
      if (brick.active) {
        player.draw(
          brick.color,
          brick.x,
          brick.y,
          brick.width,
          brick.height,
        );
      }
    }

    player.draw(
      'red',
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
    const { header } = this;
    if (this.score === 100 * (this.levelIndex + 1) * this.bricks.length) {
      this.score = 0;
      this.levelIndex += 1;
      header.innerHTML = `You won level ${this.levelIndex} :)`;

      if (this.levelIndex === 3) {
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

  init(level) {
    this.bricks = [];
    this.player.x = START_PLAYER_POS_X;
    this.ball.x = Math.random() * (canvas.width - 2 * INDENT) + INDENT;
    this.ball.y = START_BALL_POS_Y;

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level.length; x++) {
        if (level[y][x]) {
          this.bricks.push(new Brick(
            100 + x * this.brickParameters.width,
            100 + y * this.brickParameters.height,
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
    ball.x = Math.random() * (canvas.width - 2 * INDENT) + INDENT;
    this.init(LEVELS[this.levelIndex]);
  }

  bounceOffCeiling() {
    const { ball } = this;
    const ballTop = ball.y - ball.r,
          hitCeiling = ballTop + ball.speedY <= 0;

    if (hitCeiling) {
      ball.speedY *= -1;
      ball.y += BOOST;
    }
  }

  bounceOffWalls() {
    const { ball } = this;
    const ballLeft = ball.x - ball.r,
          ballRight = ball.x + ball.r;

    const hitLeftWall = ballLeft + ball.speedX <= 0,
          hitRightWall = ballRight + ball.speedX >= canvas.width;

    const hitWalls = hitLeftWall || hitRightWall;

    if (hitWalls) {
      if (ball.x < canvas.width / 2) {
        ball.x += BOOST;
      } else {
        ball.x -= BOOST;
      }

      ball.speedX *= -1;
    }
  }

  bounceOffPlayer() {
    const { ball, player } = this;
    const ballBottom = ball.y + ball.r,
          ballCenter = ball.x,
          playerTop = player.y,
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
        this.score += 100 * (this.levelIndex + 1);
        brick.active = false;
        ball.speedY *= -1;
        break;
      }
    }
  }

  playgame = () => {
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
  };
}

const ball = new Ball(canvasCtx, 10),
      player = new Player(canvasCtx, headerElement, 100, 20, SPEED, ball),
      game = new Game(
        headerElement,
        scoreLabelElement,
        bestScoreLabelElement,
        START_SCORE,
        START_BEST_SCORE,
        START_LEVEL_INDEX,
        ball,
        player,
        BRICK_PARAMETERS,
        START_BRICKS,
      );

game.init(LEVELS[START_LEVEL_INDEX]);
setInterval(game.playgame, 1);
