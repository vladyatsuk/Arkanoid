'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const width = 600;
const height = 600;
canvas.width = width;
canvas.height = height;

const player = {
  x: canvas.width / 2 - 75,
  y: canvas.height - 40,
  width: 150,
  height: 20,
  speed: 200,
  leftKey: false,
  rightKey: false,
};
const ball = {
  x: canvas.width / 2 - 5,
  y: canvas.width / 2,
  width: 10,
  height: 10,
  speed: 300,
  angle: Math.PI / 4 + (Math.random() * Math.PI) / 2,
};

const blocks = [
  { x: 50, y: 50, width: 50, height: 25 },
  { x: 100, y: 50, width: 50, height: 25 },
  { x: 150, y: 50, width: 50, height: 25 },
  { x: 200, y: 50, width: 50, height: 25 },
];

const borders = [
  { x: 0, y: -10, width: canvas.width, height: 20 },
  { x: canvas.width, y: 0, width: 20, height: canvas.height },
  { x: 0, y: canvas.height, width: canvas.width, height: 20 },
  { x: -10, y: 0, width: 20, height: canvas.height },
];

const drawBall = (color, x, y, r) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
};

let drawRectangle = function (obj) {
  context.beginPath();
  context.rect(obj.x, obj.y, obj.width, obj.height);
  context.strokeStyle = 'green';
  context.stroke();
};

const clearCanvas = function () {
  canvas.width = canvas.width;
};

function isIntersection(blockA, blockB) {
  const points = (block) => {
    const array = [
      { x: block.x, y: block.y },
      { x: block.x + block.width, y: block.y },
      { x: block.x, y: block.y + block.height },
      { x: block.x + block.width, y: block.y + block.height },
    ];
    return array;
  };

  const pointsA = points(blockA);
  const pointsB = points(blockB);

  const checker = (points, block) => {
    for (const point of points) {
      if (
        block.x <= point.x &&
        point.x <= block.x + block.width &&
        block.y <= point.y &&
        point.y <= block.y + block.height
      )
        return true;
    }
  };

  checker(pointsA, blockB);
  checker(pointsB, blockA);
}
function toggleItem(array, item) {
  if (array.includes(item)) {
    const index = array.indexOf(item);
    array.splice(index, 1);
  } else {
    array.push(item);
  }
}

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
let prevTime = 0;
const moveBall = function (currTime) {
  requestAnimationFrame(moveBall);
  clearCanvas();
  let deltaInSeconds = (currTime - prevTime) / 1000;
  prevTime = currTime;
  ball.x += deltaInSeconds * ball.speed * Math.cos(ball.angle);
  ball.y -= deltaInSeconds * ball.speed * Math.sin(ball.angle);
  if (player.leftKey) {
    player.x = Math.max(0, player.x - deltaInSeconds * player.speed);
  }
  if (player.rightKey) {
    player.x = Math.min(
      canvas.width - player.width,
      player.x + deltaInSeconds * player.speed
    );
  }
  for (const block of blocks) {
    if (isIntersection(block, ball)) {
      toggleItem(blocks, block);
      const topHitbox = {
        x: block.x - 10,
        y: block.y - 10,
        width: 10 + block.width,
        height: 10,
      };
      const rightHitbox = {
        x: block.x + block.width,
        y: block.y - 10,
        width: 10,
        height: 10 + block.height,
      };
      const bottomHitbox = {
        x: block.x,
        y: block.y + block.height,
        width: block.width + 10,
        height: 10,
      };
      const leftHitbox = {
        x: block.x - 10,
        y: block.y,
        width: 10,
        height: block.height + 10,
      };
      if (
        isIntersection(topHitbox, ball) ||
        isIntersection(bottomHitbox, ball)
      ) {
        ball.angle = 2 * Math.PI - ball.angle;
      }
      if (
        isIntersection(rightHitbox, ball) ||
        isIntersection(leftHitbox, ball)
      ) {
        ball.angle = Math.PI - ball.angle;
      }
    }
  }
  if (isIntersection(borders[0], ball) || isIntersection(borders[2], ball)) {
    ball.angle = 2 * Math.PI - ball.angle;
  }
  if (isIntersection(borders[1], ball) || isIntersection(borders[3], ball)) {
    ball.angle = Math.PI - ball.angle;
  }

  if (isIntersection(ball, player)) ball.angle = 2 * Math.PI - ball.angle;

  drawRectangle(ball);
  for (const block of blocks) drawRectangle(block);
  drawRectangle(player);
};

moveBall(0);
