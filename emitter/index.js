function Emitter() {
  const map = {};

  this.on = (event, cb) => {
    if (!map[event]) {
      map[event] = { on: [], once: [] };
    }
    map[event].on.push(cb);
  };

  this.once = (event, cb) => {
    if (!map[event]) {
      map[event] = { on: [], once: [] };
    }
    map[event].once.push(cb);
  };

  this.emit = (event) => {
    if (!map[event]) return;
    map[event].on.forEach(cb);
    map[event].once.forEach(cb);
    map[event].once.length = 0;
  };

  this.off = (event) => {
    if (!map[event]) return;
    map[event].on.length = 0;
    map[event].once.length = 0;
  };
}

const emitter = new Emitter();
emitter.on("test", () => console.log("test"));
emitter.emit("test");
emitter.emit("test");
