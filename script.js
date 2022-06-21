'use strict';
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

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
  size: 10,
  speedX: 100,
  speedY: 100,
};

const borders = [
  { x: 0, y: -10, width: canvas.width, height: 20 },
  { x: canvas.width, y: 0, width: 20, height: canvas.height },
  { x: 0, y: canvas.height, width: canvas.width, height: 20 },
  { x: -10, y: 0, width: 20, height: canvas.height },
];
const brick = {
  width: 20,
  height: 10,
}
let bricks = [];
const init = () => {
  bricks = [];
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 100;
  ball.speedX = 0.1;
  ball.speedY = -0.1;
  for(let y = 0; y < 4; y++){
    for(let x = y; x < 10 - y; x++){
      bricks.push(
        {x: 50 + x*brick.width,
         y: 50 + y*brick.height,
        active: true});
      }
  }  
}

const drawBall = (color, x, y, r) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
};

let drawRectangle = (color, x, y, width, height) => {
  context.fillStyle = color;
  context.beginPath();
  context.rect(x, y, width, height);
  context.fill();
  context.stroke();
};

const clearCanvas = function () {
  canvas.width = canvas.width;
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

const changeDirection = () => {
  if (
    ball.x - ball.size + ball.speedX < 0 ||
    ball.x + ball.size + ball.speedX > canvas.width
  )
    ball.speedX = -ball.speedX;
  if (ball.y - ball.size + ball.speedY < 0) ball.speedY = -ball.speedY;
  if (ball.y - ball.size > player.y) return false;
  if (
    ball.y + ball.size > player.y &&
    ball.x + ball.size > player.x - player.width / 2 &&
    ball.x - ball.size < player.x + player.width / 2
  )
    ball.speedY = -ball.speedY;
    for(let i = 0; i < bricks.length; i++){
      if (!bricks[i].active) continue;
      if (bricks[i].x < ball.x + ball.size &&
          ball.x - ball.size < bricks[i].x + brick.width &&
          bricks[i].y < ball.y + ball.size &&
          ball.y - ball.size < bricks[i].y + brick.height){
            bricks[i].active = false;
            ball.speedY = -ball.speedY;
            break;
          }
    }
    return true;
};

let prevTime = 0;
const moveBall = function (currTime) {
  requestAnimationFrame(moveBall);
  clearCanvas();
  let deltaInSeconds = (currTime - prevTime) / 1000;
  prevTime = currTime;
  ball.x += 0.1;
  ball.y -= 0.1;

  if (player.leftKey) {
    player.x = Math.max(0, player.x - deltaInSeconds * player.speed);
  }
  if (player.rightKey) {
    player.x = Math.min(canvas.width - player.width, player.x + deltaInSeconds * player.speed);
  }

  drawBall('blue', canvas.width/2, canvas.height/2, 10);
  drawRectangle('red', player.x, player.y, player.width, player.height);
};

moveBall(0);
