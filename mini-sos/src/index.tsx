import React, { useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";

import SOS, { ReactRendererSID } from "./SOS";

// TODO: move to html script
// 初始化容器
const sos = new SOS();
globalThis.sos = sos;
sos.container.bind(ReactRendererSID).toConstantValue(ReactDOM);
sos.bootstrap();

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
