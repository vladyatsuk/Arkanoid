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
  speed: 3,
  leftKey: false,
  rightKey: false,
};
const ball = {
  x: canvas.width / 2,
  y: canvas.width / 2,
  size: 10,
  speedX: 2,
  speedY: 2,
};

const brick = {
  width: 50,
  height: 25,
}
let bricks = [];
const init = () => {
  bricks = [];
  ball.x = canvas.width / 2;
  ball.y = player.y - 10;
  ball.speedX = 2;
  ball.speedY = 2;
  for(let y = 0; y < 4; y++){
    for(let x = 0; x < 10; x++){
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

const draw = () => {
  drawRectangle('white', 0, 0, canvas.width, canvas.height);
  drawBall('red', ball.x, ball.y, ball.size);
  for(let i = 0; i < bricks.length; i++){
    if(!bricks[i].active) continue;
    drawRectangle('green', bricks[i].x, bricks[i].y, brick.width, brick.height);
  }
  drawRectangle('red', player.x, player.y, player.width, player.height);
}

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

const move = () => {

  if (player.leftKey) {
    player.x = Math.max(0, player.x - player.speed);
  }
  if (player.rightKey) {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
  }


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
    ball.x += ball.speedX; console.log(ball.x);
    ball.y -= ball.speedY;
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

const game = () => {
  if(!move()){
    console.log('Game over :(');
    init();
  }
    draw();
}
const frameTime = 16.67;
init();
setInterval(game, 1);