import { Container } from "inversify";
import "reflect-metadata";

import { ModuleService, ModuleServiceSID, ReactRendererSID } from "./services";
import { resolveBundleURL } from "./utils";

const g_config = {
  app: {
    default: "com.test.bundle.Demo",
    // 每一项都是一个 bundle 导出模块
    // 我们在这里配置这个模块的路由等信息
    list: [
      {
        bundleName: "com.test.bundle",
        displayName: "测试 DEMO",
        entryPoint: "Demo",
        name: "Demo",
        resources: [
          {
            type: "css",
            url: "index.css",
          },
        ],
        routePath: "/demo",
        uuid: "com.test.bundle.Demo",
      },
    ],
  },
  bundle: {
    list: [
      {
        bundleName: "com.test.bundle",
        modulePath: "bundle.index.201cacd3f11bfdf59a72.js",
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
      },
    ],
  },
  lib: {
    list: [
      {
        bundleName: "moment",
        preload: true,
        resources: [
          /*{
          type: "css",
          url: "index.css",
        },*/
        ],
      },
    ],
  },
};

// ServeOS -> SOS
class SOS {
  constructor() {
    if (!globalThis.requirejs) {
      throw new Error("SOS requires requirejs");
    }
    this.container = new Container({ defaultScope: "Singleton" });

    globalThis.requirejs.onResourceLoad = (context, map) => {
      // 每个模块可以导出一个默认模块，用来往容器上绑定一些服务
      // 比如 reactRenderer
      const module = context.defined[map.name];
      if (module.default) {
        // TODO: 这里一股脑儿的调用 default 函数了，可以给 default 函数加个标识
        // 只有当是你真的想对容器做点什么的时候，才调用 default 函数
        module.default(this.container);
      }
    };
  }

  bootstrap() {
    // TODO: requirejs 应该会等待所有资源家在完成才会继续吧，毕竟通过 script tag
    const services = [
      [ModuleServiceSID, ModuleService], // 提供模块注册和加载服务
    ];
    // register built-in services
    services.forEach(([name, service]) => {
      this.container.bind(name).to(service);
    });

    // register/load services from config
    // bundle
    const bundleList = g_config.bundle.list || [];
    bundleList.forEach((bundle) => {
      const { registerModule } = this.container.get(ModuleServiceSID);
      registerModule(bundle.packageName, resolveBundleURL(bundle));
    });
    // lib
    const libList = g_config.lib.list || [];
    libList.forEach((lib) => {
      const matchingBundle = bundleList.find(
        (bundle) => bundle.bundleName === lib.bundleName
      );
      if (!matchingBundle) {
        console.log(`lib ${lib.bundleName} not found`);
      }
      if (lib.preload) {
        // 应用场景比如说，webpack externals 配置
        // TODO: preload 什么用，我发现如果你没有加载一个模块，但是 amd 是话，没有的话，默认回去 requirejs 里的配置里找并且加载
        // 所以作用应该不是依赖的问题，而是单纯的 preload
        // 网络请求里也是，等待依赖的模块要加载的时候才会进行加载
        // preload 什么用 可以看下 MDN
        const { loadModule } = this.container.get(ModuleServiceSID);
        loadModule(matchingBundle.bundleName);
        // TODO: 如果这个库有依赖的资源那么也加载
      }
    });

    // load default app （一般是壳应用，类似 yodajs）
    const defaultApp = g_config.app.default;
    const target = document.getElementById("root");
    const { loadModule } = this.container.get(ModuleServiceSID);
    const bundleSegments = defaultApp.split(".");
    const entryPoint = bundleSegments.pop();
    const bundleName = bundleSegments.join(".");
    const matchingBundle = bundleList.find(
      (bundle) => bundle.bundleName === bundleName
    );
    loadModule(matchingBundle.packageName).then((module) => {
      const { render } = this.container.get(ReactRendererSID);
      render(module[entryPoint](), target);
    });
  }
}

export default SOS;
