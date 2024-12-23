import {
  BRICK_WIDTH,
  BRICK_HEIGHT,
  BRICK_X_OFFSET,
  BRICK_Y_OFFSET,
} from '../constants/brick.js';

import {
  BALL_CONFIG,
  PLAYER_CONFIG,
  BRICK_CONFIG,
} from '../constants/factory.js';

import { GAME_COLORS } from '../constants/game.js';
import Ball from '../entities/Ball.js';
import Player from '../entities/Player.js';
import Brick from '../entities/Brick.js';

class EntityFactory {
  static createBall(options = {}) {
    return new Ball({ ...BALL_CONFIG, ...options });
  }

  static createPlayer(options = {}) {
    return new Player({ ...PLAYER_CONFIG, ...options });
  }

  static createBrick(options = {}) {
    return new Brick({ ...BRICK_CONFIG, ...options });
  }

  static createBricks(level) {
    const bricks = new Set();

    for (let y = 0; y < level.length; y++) {
      for (let x = 0; x < level[0].length; x++) {
        if (level[y][x]) {
          bricks.add(this.createBrick({
            x: BRICK_X_OFFSET + x * BRICK_WIDTH,
            y: BRICK_Y_OFFSET + y * BRICK_HEIGHT,
            color: GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)],
          }));
        }
      }
    }

    return bricks;
  }

  static createEntities(levelStructure) {
    return {
      ball: this.createBall(),
      player: this.createPlayer(),
      bricks: this.createBricks(levelStructure),
    };
  }
}

export default EntityFactory;
