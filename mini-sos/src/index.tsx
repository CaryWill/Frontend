import React, { useEffect, Suspense, lazy } from "react";
import { render } from "react-dom";

import SOS from "./SOS";

// TODO: move to html script
// 初始化容器
const sos = new SOS();
window.sos = sos;
sos.bootstrap();

export default function App() {
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
}
