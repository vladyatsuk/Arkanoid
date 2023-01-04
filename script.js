'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const scoreLabel = document.getElementById('score');
const bestScoreLabel = document.getElementById('bestScore');
const header = document.getElementById('header');
canvas.width = 600;
canvas.height = 600;

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

const speed = 1.5;
const boost = 5;
const indent = 50;
const playerStartPosX = canvas.width / 2 - 50;
const playerPosY = canvas.height - 75;
const ballStartPosY = playerPosY - 15;
let bricks = [];
let score = 0;
let bestScore = 0;
let canLaunchBall = true;
let levelIndex = 0;

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

const colors = [
  'silver',
  'maroon',
  'yellow',
  'purple',
  'lime',
  'navy',
  'teal',
  'aqua',
];

class Player {
  x = playerStartPosX;
  y = playerPosY;
  leftKey = false;
  rightKey = false;

  constructor(width, height, speed) {
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
  draw(color, x, y, width, height) {
    context.fillStyle = color;
    context.beginPath();
    context.rect(x, y, width, height);
    context.fill();
    context.stroke();
  }
  moveLeft() {
    if (this.leftKey) {
      this.x = Math.max(0, this.x - this.speed);
      return true;
    }
  }
  moveRight() {
    if (this.rightKey) {
      this.x = Math.min(canvas.width - this.width, this.x + this.speed);
      return true;
    }
  }
  setControls() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        player.leftKey = true;
      }
      if (event.code === 'KeyD' || event.code === 'ArrowRight') {
        player.rightKey = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
        player.leftKey = false;
      }
      if (event.code === 'KeyD' || event.code === 'ArrowRight') {
        player.rightKey = false;
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyS' || event.key === 'ArrowDown') {
        if (canLaunchBall) {
          header.innerHTML = 'Break all the bricks!';
          ball.speedX = speed;
          ball.speedY = speed;
          canLaunchBall = false;
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
  constructor(r) {
    this.r = r;
  }
  draw(color, x, y, r) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fill();
  }
  move() {
    this.x += this.speedX;
    this.y -= this.speedY;
  }
}
const brick= {
  width: 50,
  height: 25,
}
class Game {
  constructor(ball, player) {
    this.ball = ball;
    this.player = player;
  }
  drawScore() {
    if (score > bestScore) bestScore = score;
    scoreLabel.innerHTML = `Score: ${score}`;
    bestScoreLabel.innerHTML = `Best score: ${bestScore}`;
  }
  draw() {
    this.player.draw('white', 0, 0, canvas.width, canvas.height);
    this.ball.draw('red', this.ball.x, this.ball.y, this.ball.r);
    for (let i = 0; i < bricks.length; i++) {
      if (bricks[i].active) {
        player.draw(
          bricks[i].color,
          bricks[i].x,
          bricks[i].y,
          bricks[i].width,
          bricks[i].height
        );
      }
    }
    this.player.draw(
      'red',
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );
    this.drawScore();
  }
  isLoss() {
    const hitFloor =
      this.ball.y - this.ball.r > this.player.y + this.player.height;
    if (hitFloor) return true;
  }

  showGameStatus() {
    if (score === 100 * (levelIndex + 1) * bricks.length) {
      score = 0;
      levelIndex += 1;
      header.innerHTML = `You won level ${levelIndex} :)`;
      if (levelIndex === 3) {
        header.innerHTML = 'You won the last level :)';
        levelIndex = 0;
      }
      this.reset();
    }
    if (this.isLoss()) {
      levelIndex = 0;
      header.innerHTML = 'You lost :(';
      game.reset();
    }
    game.drawScore();
  }
  init(level) {
    bricks = [];
    this.player.x = playerStartPosX;
    this.ball.x = Math.random() * (canvas.width - 2 * indent) + indent;
    this.ball.y = ballStartPosY;
    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level.length; x++) {
        if (level[y][x])
          bricks.push(
            new Brick(
              100 + x * brick.width,
              100 + y * brick.height,
              colors[Math.floor(Math.random() * colors.length)]
            )
          );
      }
    }
    this.player.setControls();
  }
  reset() {
    score = 0;
    this.ball.speedX = 0;
    this.ball.speedY = 0;
    this.player.x = playerStartPosX;
    canLaunchBall = true;
    this.ball.x = Math.random() * (canvas.width - 2 * indent) + indent;
    this.init(LEVELS[levelIndex]);
  }
  BounceOffCeiling() {
    const hitCeiling = this.ball.y - this.ball.r + this.ball.speedY <= 0;
    if (hitCeiling) {
      this.ball.speedY *= -1;
      this.ball.y += boost;
    }
  }

  BounceOffWalls() {
    const hitWalls =
      this.ball.x - this.ball.r + this.ball.speedX <= 0 ||
      this.ball.x + this.ball.r + this.ball.speedX >= canvas.width;
    if (hitWalls) {
      if (this.ball.x < canvas.width / 2) {
        this.ball.x += boost;
      } else ball.x += -boost;
      this.ball.speedX *= -1;
    }
  }

  BounceOffPlayer() {
    const hitPlayer =
      this.ball.y + this.ball.r >= this.player.y &&
      this.ball.x >= this.player.x &&
      this.ball.x <= this.player.x + this.player.width;
    if (hitPlayer) {
      this.ball.speedY *= -1;
      this.ball.y -= boost;
      if (player.moveLeft()) this.ball.speedX = -speed;
      if (player.moveRight()) this.ball.speedX = speed;
    }
  }

  playgame = () => {
    if (canLaunchBall) this.player.x = playerStartPosX;
    this.BounceOffCeiling();
    this.BounceOffWalls();
    this.BounceOffPlayer();
    this.player.moveLeft();
    this.player.moveRight();
    this.ball.move();
    removeBrick();
    this.draw();
    this.showGameStatus();
  };
}

const removeBrick = () => {
  for (let i = 0; i < bricks.length; i++) {
    const isHitBrick =
      bricks[i].x < ball.x + ball.r &&
      ball.x - ball.r < bricks[i].x + bricks[i].width &&
      bricks[i].y < ball.y + ball.r &&
      ball.y - ball.r < bricks[i].y + bricks[i].height;
    if (bricks[i].active && isHitBrick) {
      score += 100 * (levelIndex + 1);
      bricks[i].active = false;
      ball.speedY *= -1;
      break;
    }
  }
};

const ball = new Ball(10);
const player = new Player(100, 20, 1.5);
const game = new Game(ball, player);
game.init(LEVELS[levelIndex]);
setInterval(game.playgame, 1);
