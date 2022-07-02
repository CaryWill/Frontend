import React, { useEffect, Suspense, lazy } from "react";
import SOS from "./SOS";

// http://127.0.0.1:8083/index.39bcbeb6.js

// TODO: move to html script
const sos = new SOS();
window.sos = sos;
sos.bootstrap();

// 注册模块
sos.container
  .get("ModuleService")
  .registerModule("@cary/demo", "http://127.0.0.1:8080/index.39bcbeb6");
const OtherComponent = React.lazy(() =>
  sos.container.get("ModuleService").loadModule("@cary/demo")
);

export default function App() {
  useEffect(() => {}, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
