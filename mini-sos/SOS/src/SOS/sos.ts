import { Container } from "inversify";
import "reflect-metadata";
import {
  ModuleServiceID,
  ReactRendererServiceID,
  ExtensionServiceID,
} from "./services";
import { ModuleService, ExtensionService } from "./services";
import { resolveBundleURL } from "./utils";

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
        // 也就是所谓的 隐式的注册机制
        module.default(this.container);
      }
    };
  }

  bootstrap(g_config) {
    // TODO: requirejs 应该会等待所有资源家在完成才会继续吧，毕竟通过 script tag
    const services = [
      [ModuleServiceID, ModuleService], // 提供模块注册和加载服务(register -> requirejs)
      [ExtensionServiceID, ExtensionService], // 提供扩展绑定服务(binding -> ioc container)
    ];
    // register built-in services
    services.forEach(([name, service]) => {
      this.container.bind(name).to(service);
    });

    // register/load services from config
    // 也就是所谓的 显示的注册的机制
    // bundle
    const bundleList = g_config.bundle.list || [];
    bundleList.forEach((bundle) => {
      const { registerModule } = this.container.get(ModuleServiceID);
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
        const { loadModule } = this.container.get(ModuleServiceID);
        loadModule(matchingBundle.bundleName);
        // TODO: 如果这个库有依赖的资源那么也加载
      }
    });
    // extension
    const extensionList = g_config.extension.list || [];
    extensionList.forEach((extension) => {
      const { registerExtension } = this.container.get(ExtensionServiceID);
      registerExtension(extension);
    });

    // load default app （一般是壳应用，类似 yodajs）
    const defaultApp = g_config.app.default;
    const target = document.getElementById("root");
    const { loadModule } = this.container.get(ModuleServiceID);
    const bundleSegments = defaultApp.split(".");
    const entryPoint = bundleSegments.pop();
    const bundleName = bundleSegments.join(".");
    const matchingBundle = bundleList.find(
      (bundle) => bundle.bundleName === bundleName
    );
    loadModule(matchingBundle.packageName).then((module) => {
      const { render } = this.container.get(ReactRendererServiceID);
      render(module[entryPoint](), target);
    });
  }
}

export default SOS;
