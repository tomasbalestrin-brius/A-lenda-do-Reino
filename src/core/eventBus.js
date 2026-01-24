// Pub/Sub simples para eventos do jogo
class EventBus {
  constructor() {
    this.events = {};
  }
  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = (this.events[event] || []).filter(
        (cb) => cb !== callback,
      );
    };
  }
  publish(event, data) {
    (this.events[event] || []).forEach((cb) => cb(data));
  }
  clear(event) {
    if (event) delete this.events[event];
    else this.events = {};
  }
}

export const eventBus = new EventBus();
