import React, { useEffect } from "react";
import sos from "./SOS";
// http://127.0.0.1:8083/index.39bcbeb6.js
export default function App() {
  useEffect(() => {
    // test only
    window.sos = new SOS();
  }, []);

  return <span>Hello, world!</span>;
}
