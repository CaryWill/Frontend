import React from "react";
import moment from "moment";

export function App() {
  return moment(new Date()).format("YYYY-MM-DD");
}

export function Demo() {
  return "It's a demo!";
}

export default () => {
  globalThis.sos.container
    .bind(Symbol.for("ReactRenderer"))
    .toConstantValue(ReactDOM);
};
