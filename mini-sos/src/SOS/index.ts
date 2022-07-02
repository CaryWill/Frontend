import { Container } from "inversify";
import 'reflect-metadata';

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
      this.container.bind(name).to(service).inSingletonScope();
    });

    // TODO: register services from config --
    const config = [
      {
        bundleName: "testbundle",
        modulePath: "index.js",
        packageName: "@cary/test",
        url: "http://127.0.0.1:8080/index.39bcbeb6.js",
        version: "0.1.0",
      },
    ];
  }
}

export default SOS;
