import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants/canvas.js';
import {
  CANVAS_ID,
  CURRENT_SCORE_ID,
  BEST_SCORE_ID,
  GAME_MESSAGE_ID,
} from './constants/html.js';

import Renderer from './ui/Renderer.js';
import Game from './Game.js';

const main = () => {
  const canvas = document.getElementById(CANVAS_ID),
        // @ts-ignore
        ctx = canvas.getContext('2d');

  Object.assign(canvas, { width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  const currentScoreElement = document.getElementById(CURRENT_SCORE_ID),
        bestScoreElement = document.getElementById(BEST_SCORE_ID),
        gameMessageElement = document.getElementById(GAME_MESSAGE_ID);

  const renderer = new Renderer({
    ctx,
    currentScoreElement,
    bestScoreElement,
    gameMessageElement,
  });

  const game = new Game(renderer);

  game.start();
};

main();
