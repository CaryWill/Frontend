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
  .registerModule(
    "@cary/demo",
    "https://cdn.jsdelivr.net/gh/CaryWill/Frontend/mini-sos/Demo/bundle.amd"
  );

const myModule = sos.container
  .get("ModuleService")
  .loadModule("@cary/demo")
  .then((m) => console.log(m));
console.log(myModule)
//const OtherComponent = React.lazy(() =>
//);

export default function App() {
  useEffect(() => {}, []);

  return <Suspense fallback={<div>Loading...</div>}></Suspense>;
}
