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
const playerStartPosX = canvas.width / 2 - 50;
const playerPosY = canvas.height - 75;
let bricks = [];
let score = 0;
let bestScore = 0;
let hitCeiling = 0;
let hitFloor = 0;
let hitWalls = 0;
let hitPlayer = 0;
let canClickS = true;
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
  speed: speed,
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

document.addEventListener('keydown', function (event) {
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    player.leftKey = true;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    player.rightKey = true;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    player.leftKey = false;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    player.rightKey = false;
  }
});

const init = (level) => {
  bricks = [];
  player.x = playerStartPosX;
  ball.x = Math.random() * (canvas.width - 100) + 50;
  ball.y = player.y - 15;
  document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyS' || event.key === 'ArrowDown') {
      if (canClickS) {
        header.innerHTML = 'Break all the bricks!';
        ball.speedX = speed;
        ball.speedY = speed;
        canClickS = false;
      }
    }
  });
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

const hitBrick = (bricks, i) => {
  return (
    bricks[i].x < ball.x + ball.r &&
    ball.x - ball.r < bricks[i].x + brick.width &&
    bricks[i].y < ball.y + ball.r &&
    ball.y - ball.r < bricks[i].y + brick.height
  );
};

const move = () => {
  hitCeiling = ball.y - ball.r + ball.speedY <= 0;
  hitFloor = ball.y - ball.r > player.y + player.height;
  hitWalls =
    ball.x - ball.r + ball.speedX <= 0 ||
    ball.x + ball.r + ball.speedX >= canvas.width;
  hitPlayer =
    ball.y + ball.r >= player.y &&
    ball.x >= player.x &&
    ball.x <= player.x + player.width;
  if (ball.speedX === 0) player.x = playerStartPosX;
  if (hitWalls) {
    if (ball.x < canvas.width / 2) {
      ball.x += boost;
    } else ball.x += -boost;
    ball.speedX *= -1;
  }
  if (hitCeiling) {
    ball.speedY *= -1;
    ball.y += boost;
  }
  if (hitPlayer) {
    ball.speedY *= -1;
    ball.y -= boost;
  }
  if (hitFloor) return false;
  if (player.leftKey) {
    player.x = Math.max(0, player.x - player.speed);
    if (hitPlayer) ball.speedX = -speed;
  }
  if (player.rightKey) {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    if (hitPlayer) ball.speedX = speed;
  }
  ball.x += ball.speedX;
  ball.y -= ball.speedY;
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].active && hitBrick(bricks, i)) {
      bricks[i].active = false;
      score += 100 * (levelIndex + 1);
      ball.speedY *= -1;
      break;
    }
  }
  return true;
};

const reset = () => {
  score = 0;
  ball.speedX = 0;
  ball.speedY = 0;
  player.x = canvas.width / 2 - 50;
  canClickS = true;
  ball.x = Math.random() * (canvas.width - 100) + 50;
  init(LEVELS[levelIndex]);
};

const game = () => {
  if (score === 100 * (levelIndex + 1) * bricks.length && levelIndex < 3) {
    score = 0;
    levelIndex += 1;
    header.innerHTML = `You won level ${levelIndex} :)`;
    reset();
    if (levelIndex === 3) {
      header.innerHTML = `You won the last level :)`;
      levelIndex = 0;
      reset();
    }
  }
  if (!move()) {
    header.innerHTML = 'You lost :(';
    reset();
    drawScore();
  } else draw();
};
init(LEVELS[levelIndex]);
setInterval(game, 1);
