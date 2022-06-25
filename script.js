'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

const speed = 1.5;
const startPosX = canvas.width / 2 - 50;
let bricks = [];
let brickColors = [];
let points = 0;
let hitCeiling = 0;
let hitFloor = 0;
let hitWalls = 0;
let hitPlayer = 0;

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
  x: canvas.width / 2 - 50,
  y: canvas.height - 75,
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
  speedX: speed,
  speedY: speed,
};

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    player.leftKey = true;
  } else if (event.key === 'ArrowRight') {
    player.rightKey = true;
  }
});

document.addEventListener('keyup', function (event) {
  if (event.key === 'ArrowLeft') {
    player.leftKey = false;
  } else if (event.key === 'ArrowRight') {
    player.rightKey = false;
  }
});

const init = () => {
  bricks = [];
  player.x = startPosX;
  ball.x = canvas.width / 2;
  ball.y = player.y - 15;
  ball.speedX = speed;
  ball.speedY = speed;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 8; x++) {
      brickColors.push(colors[Math.floor(Math.random() * (colors.length + 1))]);
      bricks.push({
        x: 100 + x * brick.width,
        y: 100 + y * brick.height,
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

const draw = () => {
  drawRectangle('white', 0, 0, canvas.width, canvas.height);
  drawBall('red', ball.x, ball.y, ball.r);
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].active) {
      drawRectangle(
        brickColors[i],
        bricks[i].x,
        bricks[i].y,
        brick.width,
        brick.height
      );
    }
  }
  drawRectangle('red', player.x, player.y, player.width, player.height);
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
  if (hitWalls) ball.speedX *= -1;
  if (hitCeiling) {
    ball.speedY *= -1;
    ball.y += 5;
  }
  if (hitPlayer) {
    ball.speedY *= -1;
    ball.y -= 1;
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
      points += 100;
      ball.speedY *= -1;
      break;
    }
  }
  return true;
};
const game = () => {
  if (!move()) {
    points = 0;
    brickColors = [];
    player.x = canvas.width / 2 - 50;
    init();
    ball.x = Math.random() * 500 + 50;
  } else draw();
};
init();
setInterval(game, 1);
