class Iocos {
  constructor() {
    if (!globalThis.requirejs) {
      throw new Error("Iocos requires requirejs");
    }
  }

  registerModule(name, url) {
    globalThis.requirejs.config({
      paths: {
        [name]: url,
      },
    });
  }

  loadModule(name) {
    return new Promise((resolve, reject) => {
      globalThis.requirejs(
        [name],
        (module) => {
          resolve(module);
        },
        (err) => {
          reject("module load failed: ", err);
        }
      );
    });
  }

  bootstrap(config = []) {
    // this.container.bind 和 get 什么时候用的
    config.list.forEach(({ name, url }) => {
      this.registerModule(name, url);
    });
  }
}
