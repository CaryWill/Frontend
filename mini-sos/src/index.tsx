import React, { useEffect, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import SOS from "./SOS";

// TODO: move to html script
const sos = new SOS();
window.sos = sos;
sos.bootstrap();

// 注册模块
sos.container
  .get("ModuleService")
  .registerModule(
    "@cary/demo",
    "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/Demo/mybundle"
  );

export default function App() {
  useEffect(() => {
    const myModule = window.sos.container
      .get("ModuleService")
      .loadModule("@cary/demo");

    myModule.then((m) => {
      const container = document.getElementById("container");
      const root = createRoot(container);
      root.render(m.default());
    });
  }, []);

  return <div id="container"></div>;
}
