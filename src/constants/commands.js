const COMMANDS = {
  MOVE_LEFT: 'moveLeft',
  MOVE_RIGHT: 'moveRight',
  LAUNCH_BALL: 'launchBall',
};

const COMMANDS_TO_CODES = {
  [COMMANDS.MOVE_LEFT]: new Set(['KeyA', 'ArrowLeft']),
  [COMMANDS.MOVE_RIGHT]: new Set(['KeyD', 'ArrowRight']),
  [COMMANDS.LAUNCH_BALL]: new Set(['KeyS', 'ArrowDown']),
};

export { COMMANDS, COMMANDS_TO_CODES };
