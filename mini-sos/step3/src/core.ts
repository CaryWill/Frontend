import { Container } from "inversify";
import "reflect-metadata";
import {
  ModuleServiceID,
  ReactRendererServiceID,
  ExtensionServiceID,
  ModuleService,
  ExtensionService,
} from "@/services";
import { resolveBundleURL } from "@/utils";
import { Bundle, Lib, Extension } from "@/types";

interface ServOS {
  container: Container;
}

class SOS implements ServOS {
  public container: Container;

  constructor() {
    this.container = new Container({ defaultScope: "Singleton" });
    requirejs.onResourceLoad = (context: any, map: any) => {
      // 每个模块可以导出一个默认模块 `export default`，用来往容器上绑定一些服务
      // 也就是所谓的 隐式注册
      const module = context.defined[map.name];
      if (module.default) {
        // TODO: 这里一股脑儿的调用 default 函数了，可以给 default 函数加个标识
        module.default(this.container);
      }
    };
  }

  bootstrap(g_config: any) {
    // register built-in services
    const services = [
      [ModuleServiceID, ModuleService], // 提供模块注册和加载服务 // requirejs([])
      [ExtensionServiceID, ExtensionService], // 提供扩展绑定服务 // container.getAll
    ];
    services.forEach(([name, service]: any) => {
      this.container.bind(name).to(service);
    });
    const { registerModule, loadModule } =
      this.container.get<ModuleService>(ModuleServiceID);
    const { registerExtension } =
      this.container.get<ExtensionService>(ExtensionServiceID);

    //  开始显式注册
    // bundle
    const bundleList = g_config.bundle.list || [];
    const bundles: { [key: string]: Bundle } = {};
    bundleList.forEach((bundle: Bundle) => {
      registerModule(bundle.packageName, resolveBundleURL(bundle));
      bundles[bundle.bundleName] = bundle;
    });

    // 预加载一些 bundle
    const libList = g_config.lib.list || [];
    libList.forEach((lib: Lib) => {
      if (bundles[lib.bundleName] && lib.preload) {
        loadModule(lib.bundleName);
        // TODO: 如果这个库有依赖的资源那么也加载，比如 CSS
      }
    });

    // 绑定 extension 到 ioc container 上
    const extensionList = g_config.extension.list || [];
    extensionList.forEach((extension: Extension) => {
      registerExtension(extension);
    });

    // 加载壳应用，类似 yodajs, 提供路由, 状态管理等服务
    const defaultApp = g_config.app.default;
    const [, bundleName, entryPoint] = defaultApp.match(/(.*)[.](.*)/);
    const bundle = bundles[bundleName];
    loadModule(bundle.packageName).then((module: any) => {
      // 一般壳应用会使用隐式注册往 ioc container 上注册一个 ReactRendererService 服务供我们使用
      const { render } = this.container.get<any>(ReactRendererServiceID);
      const target = document.getElementById("root");
      render(module[entryPoint](), target);
    });
  }
}

export default SOS;
