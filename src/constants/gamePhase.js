export const PHASES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  LEVEL_DONE: 'levelDone',
  LOST: 'lost',
};

export const TRANSITIONS = {
  [PHASES.WAITING]: new Set([PHASES.PLAYING]),
  [PHASES.PLAYING]: new Set([PHASES.LEVEL_DONE, PHASES.LOST]),
  [PHASES.LEVEL_DONE]: new Set([PHASES.WAITING]),
  [PHASES.LOST]: new Set([PHASES.WAITING]),
};
