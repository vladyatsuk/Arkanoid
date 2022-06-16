'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 200;
canvas.height = 200;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 15,
  width: 150,
  height: 20,
  speed: 15,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.width / 2,
  width: 10,
  height: 10,
  speed: 300,
  angle: Math.PI / 4 + (Math.random() * Math.PI) / 2,
};

const blocks = [
  { x: 50, y: 50, width: 50, height: 10 },
  { x: 100, y: 50, width: 50, height: 10 },
  { x: 150, y: 50, width: 50, height: 10 },
  { x: 200, y: 50, width: 50, height: 10 },
];

const borders = [
  { x: 0, y: -10, width: canvas.width, height: 10 },
  { x: canvas.width, y: 0, width: 10, height: canvas.height },
  { x: 0, y: canvas.height, width: canvas.width, height: 5 },
  { x: -10, y: 0, width: 10, height: canvas.height },
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

function toggleItem(array, item){
  if (array.includes(item)){
    const index = array.indexOf(item);
    array.splice(index, 1);
  }
  else{
    array.push(item);
  }
}

let prevTime = 0;
const moveBall = function (currTime) {
  requestAnimationFrame(moveBall);
  clearCanvas();
  let deltaInSeconds = (currTime - prevTime) / 1000;
  prevTime = currTime;
  ball.x += deltaInSeconds * ball.speed * Math.cos(ball.angle);
  ball.y -= deltaInSeconds * ball.speed * Math.sin(ball.angle);
  for(const block of blocks){
    if(isIntersection(block, ball)){
    toggleItem(blocks, block);
    const topHitbox ={
      x: block.x - 10,
      y: block.y - 10,
      width: 10 + block.width,
      height: 10
    };
    const rightHitbox={
      x: block.x + block.width,
      y: block.y - 10,
      width: 10,
      height: 10 + block.height
    };
    const bottomHitbox={
      x: block.x,
      y: block.y + block.height,
      width: block.width + 10,
      height: 10
    };
    const leftHitbox={
      x: block.x - 10,
      y: block.y,
      width: 10,
      height: block.height + 10
    };
    if(isIntersection(topHitbox, ball) || isIntersection(bottomHitbox, ball)){
      ball.angle = 2 * Math.PI - ball.angle;
    }
    if(isIntersection(rightHitbox, ball) || isIntersection(leftHitbox, ball)){
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

  if(isIntersection(ball, player)) ball.angle = 2*Math.PI - ball.angle;

  drawRectangle(ball);
  for(const block of blocks ) drawRectangle(block);
  drawRectangle(player);
};

moveBall(0);
