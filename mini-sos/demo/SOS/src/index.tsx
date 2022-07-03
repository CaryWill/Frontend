import React, { useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";

import SOS, { ReactRendererServiceID } from "./SOS";

// TODO: move to html script
// 初始化容器
const sos = new SOS();
globalThis.sos = sos;
const g_config = {
  app: {
    default: "com.test.bundle.Shell",
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
        modulePath: "bundle.index.js",
        packageName: "@cary/demo",
        //url: "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/demo/",
        url: "http://127.0.0.1:8080/",
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
  extension: {
    list: [
      {
        bundleName: "com.test.bundle",
        displayName: "示例扩展",
        entryPoint: "Demo",
        extensionPoints: [],
        implements: "com.xixikf.workbench.Plugin",
        name: "Demo",
        resources: [
          {
            type: "css",
            url: "index.css",
          },
        ],
      },
      {
        bundleName: "com.test.bundle",
        displayName: "示例扩展2",
        entryPoint: "App",
        extensionPoints: [],
        implements: "com.xixikf.workbench.Plugin",
        name: "App",
        resources: [
          {
            type: "css",
            url: "index.css",
          },
        ],
      },
    ],
  },
};
globalThis.g_config = g_config;
sos.bootstrap(g_config);

export default () => {};
// Load module example
/*export default function App() {
  useEffect(() => {
    const myModule = window.sos.container
      .get("ModuleService")
      .loadModule("@cary/demo");

    myModule.then((m) => {
      const container = document.getElementById("container");
      render(m.default(), container);
    });
  }, []);

  return <div id="container"></div>;
}*/
