// Sistema simples de input para exploração
class InputManager {
  constructor() {
    this.keys = {};
    this.keyMap = {
      w: "up",
      a: "left",
      s: "down",
      d: "right",
      ArrowUp: "up",
      ArrowLeft: "left",
      ArrowDown: "down",
      ArrowRight: "right",
      e: "interact",
      f: "special",
      r: "special",
      " ": "jump",
      x: "jump",
      z: "interact",
      Shift: "dash",
      1: "hero1",
      2: "hero2",
      3: "hero3",
      Escape: "pause",
    };
    this.init();
  }
  init() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }
  handleKeyDown(e) {
    const action = this.keyMap[e.key];
    if (action) {
      this.keys[action] = true;
      if (document.activeElement === document.body) e.preventDefault();
    }
  }
  handleKeyUp(e) {
    const action = this.keyMap[e.key];
    if (action) {
      this.keys[action] = false;
      if (document.activeElement === document.body) e.preventDefault();
    }
  }
  isPressed(action) {
    return !!this.keys[action];
  }
  reset() {
    this.keys = {};
  }
}

export const inputManager = new InputManager();
