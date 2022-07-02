import { Container } from "inversify";
import "reflect-metadata";

import { ModuleService } from "./services/ModuleService";

const g_config = {
  bundle: [
    {
      bundleName: "com.test.bundle",
      modulePath: "index.js",
      packageName: "@cary/demo",
      url: "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/Demo/",
      version: "0.1.0",
    },
    {
      bundleName: "antd",
      modulePath: "antd.js",
      packageName: "antd",
      url: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.21.4/",
      version: "4.21.4",
    },
  ],
  lib: [
    {
      bundleName: "antd",
      preload: true,
      resources: [],
    },
  ],
};

// ServeOS -> SOS
class SOS {
  constructor() {
    if (!globalThis.requirejs) {
      throw new Error("Iocos requires requirejs");
    }
    this.container = new Container({ defaultScope: "Singleton" });
  }

  bootstrap() {
    // TODO: requirejs 应该会等待所有资源家在完成才会继续吧，毕竟通过 script tag
    const services = [
      ["ModuleService", ModuleService], // 提供模块注册和加载服务
    ];
    // register built-in services
    services.forEach(([name, service]) => {
      this.container.bind(name).to(service);
    });

    // register/load services from config
    // bundle
    const bundleList = g_config.bundle || [];
    bundleList.forEach((bundle) => {
      const { registerModule } = this.container.get("ModuleService");
      const getBundleURL = () => {
        const segments = (bundle.url + bundle.modulePath).split(".");
        // remove extension
        segments.pop();
        return segments.join(".");
      };
      registerModule(bundle.name, getBundleURL());
    });

    // lib
    const libList = g_config.lib || [];
    libList.forEach((lib) => {
      const matchingBundle = bundleList.find(
        (bundle) => bundle.bundleName === lib.bundleName
      );
      if (!matchingBundle) {
        throw new Error(`lib ${lib.bundleName} not found`);
      }
      if (lib.preload) {
        // 应用场景比如说，webpack externals 配置
        const { loadModule } = this.container.get("ModuleService");
        loadModule(matchingBundle.bundleName);
      }
    });
  }
}

export default SOS;
