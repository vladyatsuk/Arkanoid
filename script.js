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
  angle: Math.Pi / 4 + (Math.random() * Math.Pi) / 2,
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
