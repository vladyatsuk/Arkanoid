import { CANVAS_CENTER_X, CANVAS_BOTTOM } from './canvas.js';

export const PLAYER_WIDTH = 100;
export const PLAYER_HEIGHT = 20;
// eslint-disable-next-line no-magic-numbers
export const PLAYER_X_OFFSET = -(PLAYER_WIDTH / 2);
export const PLAYER_Y_OFFSET = -75;
export const PLAYER_START_X = CANVAS_CENTER_X + PLAYER_X_OFFSET;
export const PLAYER_START_Y = CANVAS_BOTTOM + PLAYER_Y_OFFSET;
export const PLAYER_SPEED = 1.5;
export const PLAYER_COLOR = 'red';
