// Publisher/Subscriber
// In the Observer/Observable pattern, the observers are aware of the observable. Whereas, in Publisher/Subscriber, publishers and subscribers don't need to know each other. They simply communicate with the help of message queues.
function Emitter() {
  const map = {};

  this.on = (event, cb) => {
    if (!map[event]) {
      map[event] = [];
    }
    map[event].push(cb);
  };

  this.once = (event, cb) => {
    if (!map[event]) {
      map[event] = [];
    }
    const _cb = (...args) => {
      cb(...args);
      this.off(event, _cb);
    };
    this.on(event, _cb);
  };

  this.emit = (event, ...args) => {
    if (!map[event]) return;
    map[event].forEach((cb) => cb(...args));
  };

  this.off = (event, cb) => {
    if (!map[event]) return;
    const index = map[event].findIndex((item) => item === cb);
    if (index !== -1) {
      map[event].splice(index, 1);
    }
  };
}

const emitter = new Emitter();
emitter.once("test", () => console.log("test"));
emitter.emit("test");
emitter.emit("test");
