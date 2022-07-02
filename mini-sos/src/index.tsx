import React, { useEffect, Suspense, lazy } from "react";
import { render } from "react-dom";

import SOS from "./SOS";

// TODO: move to html script
const sos = new SOS();
window.sos = sos;
sos.bootstrap();

// 注册模块
/*sos.container
  .get("ModuleService")
  .registerModule(
    "@cary/demo",
    "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/Demo/mybundle"
  );*/

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
