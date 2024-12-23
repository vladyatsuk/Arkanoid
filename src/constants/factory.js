import { CANVAS_START_X, CANVAS_START_Y } from './canvas.js';

import {
  BALL_START_X,
  BALL_START_Y,
  BALL_RADIUS,
  BALL_COLOR,
  BALL_NO_SPEED_X,
  BALL_NO_SPEED_Y,
} from '../constants/ball.js';

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_COLOR,
  PLAYER_SPEED,
  PLAYER_START_X,
  PLAYER_START_Y,
} from '../constants/player.js';

import { BRICK_WIDTH, BRICK_HEIGHT, BRICK_COLOR } from '../constants/brick.js';

const BALL_CONFIG = {
  x: BALL_START_X,
  y: BALL_START_Y,
  r: BALL_RADIUS,
  speedX: BALL_NO_SPEED_X,
  speedY: BALL_NO_SPEED_Y,
  color: BALL_COLOR,
};

const PLAYER_CONFIG = {
  color: PLAYER_COLOR,
  x: PLAYER_START_X,
  y: PLAYER_START_Y,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  speed: PLAYER_SPEED,
};

const BRICK_CONFIG = {
  x: CANVAS_START_X,
  y: CANVAS_START_Y,
  width: BRICK_WIDTH,
  height: BRICK_HEIGHT,
  color: BRICK_COLOR,
};

export { BALL_CONFIG, PLAYER_CONFIG, BRICK_CONFIG };
