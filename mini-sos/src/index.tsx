import React, { useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";

import SOS from "./SOS";

// TODO: move to html script
// 初始化容器
const sos = new SOS();
window.sos = sos;
sos.container.bind("ReactRenderer").toConstantValue(ReactDOM);
console.log(sos.container.get("ReactRenderer"))
sos.bootstrap();

export default () => {}

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
