'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 15,
  width: 150,
  height: 8,
  speed: 15,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.width / 2,
  width: 10,
  height: 10,
  speed: 50,
  angle: Math.PI / 4 + (Math.random() * Math.PI) / 2,
};

const blocks = [
  { x: 50, y: 50, width: 50, height: 10 },
  { x: 100, y: 50, width: 50, height: 10 },
  { x: 150, y: 50, width: 50, height: 10 },
  { x: 200, y: 50, width: 50, height: 10 },
];

let drawRectangle = function (obj) {
  context.beginPath();
  context.rect(obj.x, obj.y, obj.width, obj.height);
  context.strokeStyle = 'green';
  context.stroke();
};

const clearCanvas = function () {
  canvas.width = canvas.width;
};

let prevTime = 0;
const moveBall = function (currTime = 0) {
  requestAnimationFrame(moveBall);
  clearCanvas();
  drawRectangle(ball);
  let deltaInSeconds = (currTime - prevTime) / 1000;
  prevTime = currTime;
  ball.x += deltaInSeconds * ball.speed;
  ball.y -= deltaInSeconds * ball.speed;
};

function isIntersection(blockA, blockB) {
  const pointsA = [
    { x: blockA.x, y: blockA.y },
    { x: blockA.x + blockA.width, y: blockA.y },
    { x: blockA.x, y: blockA.y + blockA.height },
    { x: blockA.x + blockA.width, y: blockA.y + blockA.height },
  ];

  const pointsB = [
    { x: blockB.x, y: blockB.y },
    { x: blockB.x + blockB.width, y: blockB.y },
    { x: blockB.x, y: blockB.y + blockB.height },
    { x: blockB.x + blockB.width, y: blockB.y + blockB.height },
  ];

  for (const pointA of pointsA) {
    if (
      blockB.x <= pointA.x &&
      pointA.x <= blockB.x + blockB.width &&
      blockB.y <= pointA.y &&
      pointA.y <= blockB.y + blockB.height
    )
      return true;
  }

  for (const pointB of pointsB) {
    if (
      blockA.x <= pointB.x &&
      pointB.x <= blockA.x + blockA.width &&
      blockA.y <= pointB.y &&
      pointB.y <= blockA.y + blockA.height
    )
      return true;
  }
}

const borders = [
  { x: 0, y: -10, width: canvas.width, height: 10 },
  { x: canvas.width, y: 0, width: 10, height: canvas.height },
  { x: 0, y: canvas.height, width: canvas.width, height: 5 },
  { x: -10, y: 0, width: 10, height: canvas.height },
];

moveBall(0);
