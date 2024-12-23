export const STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  LEVEL_DONE: 'levelDone',
  LOST: 'lost',
};

export const TRANSITIONS = {
  [STATES.WAITING]: new Set([STATES.PLAYING]),
  [STATES.PLAYING]: new Set([STATES.LEVEL_DONE, STATES.LOST]),
  [STATES.LEVEL_DONE]: new Set([STATES.WAITING]),
  [STATES.LOST]: new Set([STATES.WAITING]),
};
