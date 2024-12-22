import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas.js';
import { GAME_DELAY } from './constants/game.js';

import Renderer from './entities/Renderer.js';
import Game from './entities/Game.js';

const main = () => {
  const canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');

  const currentScoreElement = document.getElementById('currentScore'),
        bestScoreElement = document.getElementById('bestScore'),
        gameMessageElement = document.getElementById('gameMessage');

  const renderer = new Renderer({
    ctx,
    currentScoreElement,
    bestScoreElement,
    gameMessageElement,
  });

  const game = new Game({ renderer });

  Object.assign(canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  game.init();
  setInterval(() => game.playGame(), GAME_DELAY);
};

main();
