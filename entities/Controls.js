class Controls {
  static #handleKeyDown(event, player) {
    const { code } = event;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      player.leftKey = true;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      player.rightKey = true;
    }
  }

  static #handleKeyUp(event, player) {
    const { code } = event;

    if (code === 'KeyA' || code === 'ArrowLeft') {
      player.leftKey = false;
    }

    if (code === 'KeyD' || code === 'ArrowRight') {
      player.rightKey = false;
    }
  }

  static #handleGameStartOnKeys(event, player, renderer, ball) {
    const { code } = event;

    if (code === 'KeyS' || code === 'ArrowDown') {
      if (player.canLaunchBall) {
        renderer.drawHeader('Break all the bricks!');
        ball.speedX = player.speed;
        ball.speedY = player.speed;
        player.canLaunchBall = false;
      }
    }
  }

  static setControls(player, renderer, ball) {
    document.addEventListener('keydown', (event) => {
      this.#handleKeyDown(event, player);
      this.#handleGameStartOnKeys(event, player, renderer, ball);
    });
    document.addEventListener('keyup', (event) => {
      this.#handleKeyUp(event, player);
    });
  }
}

export default Controls;
