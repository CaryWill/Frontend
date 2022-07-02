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
        modulePath: "bundle.index.198d8afb3166f480a5ca.js",
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

    // 将每个模块里的要对 container 做的操作进行执行
    //globalThis.requirejs.onResourceLoad = (context, map) => {
      //globalThis.requirejs([map.name], [], (module) => {
        //默认调用下 default 函数，如果你需要往容器上进行什么服务的话
        //比如 react renderer
        //TODO: 更好的做法是判断下，default 函数上面是不是有什么标识说它是和容器操作相关的
        //比如加一个 id
        //if (module.default && module.default.isSOS) {
          //module.default(this.container);
        //}
      //});
    //};
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

    // load default app
    // TODO: 抽离 service identifier 到一个文件去
    const defaultApp = g_config.app.default;
    console.log(defaultApp);
    const target = document.getElementById("root");
    const { loadModule } = this.container.get(ModuleServiceSID);
    const bundleSegments = defaultApp.split(".");
    const entryPoint = bundleSegments.pop();
    console.log(entryPoint);
    const bundleName = bundleSegments.join(".");
    console.log(bundleName);
    const matchingBundle = bundleList.find(
      (bundle) => bundle.bundleName === bundleName
    );
    console.log(matchingBundle);
    loadModule(matchingBundle.packageName).then((module) => {
      //const { render } = this.container.get(ReactRendererSID);
      //console.log(render, "render");
      //render(module[entryPoint](), target);
    });
  }
}

export default SOS;
