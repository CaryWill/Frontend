import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";

export function App() {
  return moment(new Date()).format("YYYY-MM-DD");
}

export function Demo() {
  return "It's a demo!";
}

function bindingService(container) {
  if (container) {
    container.bind(Symbol.for("ReactRenderer")).toConstantValue(ReactDOM);
  }
}
bindgService.isSOS = true;
export default bindingService;
