import { Container } from "inversify";
import { ModuleService } from "./services/ModuleService";

// Serve OS
class SOS {
  constructor() {
    if (!globalThis.requirejs) {
      throw new Error("Iocos requires requirejs");
    }
    this.container = new Container();
  }

  bootstrap() {
    const services = [
      ["ModuleService", ModuleService], // 提供模块注册和加载服务
    ];

    // register built-in services
    services.forEach(([name, service]) => {
      this.container.bind(name).to(service);
    });

    // TODO: register services from config --
  }
}
