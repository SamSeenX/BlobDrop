class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    if (this.events.has(event)) {
      this.events.get(event).delete(handler);
    }
  }

  emit(event, data) {
    if (this.events.has(event)) {
      for (const handler of this.events.get(event)) {
        try {
          handler(data);
        } catch (err) {
          console.error(`[EventBus] Error in handler for "${event}":`, err);
        }
      }
    }
  }

  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();
