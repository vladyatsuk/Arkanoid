class GameMessage {
  #message = '';

  set(value) {
    this.#message = value;
  }

  get value() {
    return this.#message;
  }
}

export default GameMessage;
