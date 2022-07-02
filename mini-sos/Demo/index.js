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
  try {
    if (container) {
      container.bind(Symbol.for("ReactRenderer")).toConstantValue(ReactDOM);
    }
  } catch (err) {
    console.log(err);
  }
}
bindgService.isSOS = true;
export default bindingService;
