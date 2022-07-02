import { Container } from "inversify";
import "reflect-metadata";

import { ModuleService } from "./services/ModuleService";

const g_config = {
  bundle: [
    {
      bundleName: "com.test.bundle",
      modulePath: "bundle.index.97d3bd499a8f6ebb1a89.js",
      packageName: "@cary/demo",
      url: "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/Demo/",
      version: "",
    },
    {
      bundleName: "moment",
      modulePath: "moment.min.js",
      packageName: "moment",
      url: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/",
      version: "2.29.3",
    }
    //{
      //bundleName: "react",
      //modulePath: "umd/react.development.js",
      //packageName: "react",
      //url: "https://cdnjs.cloudflare.com/ajax/libs/react/",
      //version: "17.0.2",
    //},
    //{
      //bundleName: "react-dom",
      //modulePath: "umd/react-dom.development.min.js",
      //packageName: "react-dom",
      //url: "https://cdnjs.cloudflare.com/ajax/libs/react-dom/",
      //version: "17.0.2",
    //},
  ],
  lib: [
    //{
      //bundleName: "react",
      //preload: true,
      //resources: [],
    //},
    //{
      //bundleName: "react-dom",
      //preload: true,
      //resources: [],
    //},
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
    const resolveBundleURL = (bundle) => {
      const version = bundle.version ? `${bundle.version}/` : "";
      const segments = (bundle.url + version + bundle.modulePath).split(".");
      // remove extension
      segments.pop();
      return segments.join(".");
    };

    const bundleList = g_config.bundle || [];
    bundleList.forEach((bundle) => {
      const { registerModule } = this.container.get("ModuleService");
      registerModule(bundle.packageName, resolveBundleURL(bundle));
    });

    // lib
    const libList = g_config.lib || [];
    libList.forEach((lib) => {
      const matchingBundle = bundleList.find(
        (bundle) => bundle.bundleName === lib.bundleName
      );
      if (!matchingBundle) {
        console.log(`lib ${lib.bundleName} not found`);
      }
      if (lib.preload) {
        // 应用场景比如说，webpack externals 配置
        const { loadModule } = this.container.get("ModuleService");
        console.log(matchingBundle, "--");
        loadModule(matchingBundle.bundleName);
      }
    });
  }
}

export default SOS;
