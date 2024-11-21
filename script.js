import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_HORIZONTAL_CENTER,
  CANVAS_VERTICAL_CENTER,
} from './config/canvas.js';

import {
  BALL_COLOR,
  BALL_RADIUS,
  SPEED,
} from './config/ball.js';

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_COLOR,
  START_PLAYER_POS_X,
  START_PLAYER_POS_Y,
} from './config/player.js';

import {
  DELAY,
  START_BRICKS,
  START_SCORE,
  START_BEST_SCORE,
  START_LEVEL_INDEX,
} from './config/game.js';

import Ball from './entities/Ball.js';
import Player from './entities/Player.js';
import Game from './entities/Game.js';

const main = () => {
  const canvas = document.querySelector('canvas'),
        canvasCtx = canvas.getContext('2d');

  const scoreLabelElement = document.getElementById('score'),
        bestScoreLabelElement = document.getElementById('bestScore'),
        headerElement = document.getElementById('header');

  const ball = new Ball({
          ctx: canvasCtx,
          color: BALL_COLOR,
          x: CANVAS_HORIZONTAL_CENTER,
          y: CANVAS_VERTICAL_CENTER,
          r: BALL_RADIUS,
          speedX: 0,
          speedY: 0,
        }),
        player = new Player({
          ctx: canvasCtx,
          color: PLAYER_COLOR,
          header: headerElement,
          x: START_PLAYER_POS_X,
          y: START_PLAYER_POS_Y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          speed: SPEED,
          ball,
        }),
        game = new Game({
          ctx: canvasCtx,
          header: headerElement,
          scoreLabel: scoreLabelElement,
          bestScoreLabel: bestScoreLabelElement,
          score: START_SCORE,
          bestScore: START_BEST_SCORE,
          levelIndex: START_LEVEL_INDEX,
          ball,
          player,
          bricks: START_BRICKS,
        });

  Object.assign(canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  game.init();
  setInterval(() => game.playGame(), DELAY);
};

main();
