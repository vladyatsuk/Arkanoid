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

const brick = {
  width: 50,
  height: 25,
};

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

const player = {
  x: playerStartPosX,
  y: playerPosY,
  width: 100,
  height: 20,
  speed,
  leftKey: false,
  rightKey: false,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.width / 2,
  r: 10,
  speedX: 0,
  speedY: 0,
};

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

const init = (level) => {
  bricks = [];
  player.x = playerStartPosX;
  ball.x = Math.random() * (canvas.width - 2 * indent) + indent;
  ball.y = ballStartPosY;
  for (let y = 0; y < level.length; y++) {
    for (let x = 0; x < level.length; x++) {
      if (level[y][x])
        bricks.push({
          x: 100 + x * brick.width,
          y: 100 + y * brick.height,
          color: colors[Math.floor(Math.random() * colors.length)],
          active: true,
        });
    }
  }
};

const drawBall = (color, x, y, r) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
};

const drawRectangle = (color, x, y, width, height) => {
  context.fillStyle = color;
  context.beginPath();
  context.rect(x, y, width, height);
  context.fill();
  context.stroke();
};

const drawScore = () => {
  if (score > bestScore) bestScore = score;
  scoreLabel.innerHTML = `Score: ${score}`;
  bestScoreLabel.innerHTML = `Best score: ${bestScore}`;
};

const draw = () => {
  drawRectangle('white', 0, 0, canvas.width, canvas.height);
  drawBall('red', ball.x, ball.y, ball.r);
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].active) {
      drawRectangle(
        bricks[i].color,
        bricks[i].x,
        bricks[i].y,
        brick.width,
        brick.height
      );
    }
  }
  drawRectangle('red', player.x, player.y, player.width, player.height);
  drawScore();
};

const removeBrick = () => {
  for (let i = 0; i < bricks.length; i++) {
    const isHitBrick =
      bricks[i].x < ball.x + ball.r &&
      ball.x - ball.r < bricks[i].x + brick.width &&
      bricks[i].y < ball.y + ball.r &&
      ball.y - ball.r < bricks[i].y + brick.height;
    if (bricks[i].active && isHitBrick) {
      score += 100 * (levelIndex + 1);
      bricks[i].active = false;
      ball.speedY *= -1;
      break;
    }
  }
};

const moveLeft = () => {
  if (player.leftKey) {
    player.x = Math.max(0, player.x - player.speed);
    return true;
  }
};

const moveRight = () => {
  if (player.rightKey) {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    return true;
  }
};

const BounceOffCeiling = () => {
  const hitCeiling = ball.y - ball.r + ball.speedY <= 0;
  if (hitCeiling) {
    ball.speedY *= -1;
    ball.y += boost;
  }
};

const BounceOffWalls = () => {
  const hitWalls =
    ball.x - ball.r + ball.speedX <= 0 ||
    ball.x + ball.r + ball.speedX >= canvas.width;
  if (hitWalls) {
    if (ball.x < canvas.width / 2) {
      ball.x += boost;
    } else ball.x += -boost;
    ball.speedX *= -1;
  }
};

const BounceOffPlayer = () => {
  const hitPlayer =
    ball.y + ball.r >= player.y &&
    ball.x >= player.x &&
    ball.x <= player.x + player.width;
  if (hitPlayer) {
    ball.speedY *= -1;
    ball.y -= boost;
    if (moveLeft()) ball.speedX = -speed;
    if (moveRight()) ball.speedX = speed;
  }
};

const moveBall = () => {
  ball.x += ball.speedX;
  ball.y -= ball.speedY;
};

const isLoss = () => {
  const hitFloor = ball.y - ball.r > player.y + player.height;
  if (hitFloor) return true;
};

const reset = () => {
  score = 0;
  ball.speedX = 0;
  ball.speedY = 0;
  player.x = playerStartPosX;
  canLaunchBall = true;
  ball.x = Math.random() * (canvas.width - 2 * indent) + indent;
  init(LEVELS[levelIndex]);
};

const showGameStatus = () => {
  if (score === 100 * (levelIndex + 1) * bricks.length) {
    score = 0;
    levelIndex += 1;
    header.innerHTML = `You won level ${levelIndex} :)`;
    if (levelIndex === 3) {
      header.innerHTML = 'You won the last level :)';
      levelIndex = 0;
    }
    reset();
  }
  if (isLoss()) {
    levelIndex = 0;
    header.innerHTML = 'You lost :(';
    reset();
  }
  drawScore();
};

const game = () => {
  if (canLaunchBall) player.x = playerStartPosX;
  BounceOffCeiling();
  BounceOffWalls();
  BounceOffPlayer();
  moveLeft();
  moveRight();
  moveBall();
  removeBrick();
  draw();
  showGameStatus();
};

init(LEVELS[levelIndex]);
setInterval(game, 1);
