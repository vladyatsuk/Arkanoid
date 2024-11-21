import { START_PLAYER_POS_Y } from './player.js';

const RADIUS = 10,
      SPEED = 1.5,
      BOOST = 5,
      START_POS_Y_OFFSET = -15,
      START_POS_Y = START_PLAYER_POS_Y + START_POS_Y_OFFSET,
      COLOR = 'red';

const START_ANGLE = 0,
      // eslint-disable-next-line no-magic-numbers
      FULL_CIRCLE = 2 * Math.PI;

export {
  RADIUS,
  SPEED,
  BOOST,
  START_POS_Y,
  COLOR,
  START_ANGLE,
  FULL_CIRCLE,
};
