import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { PluginContainer } from './PluginContainer.tsx';

export function App() {
  return moment(new Date()).format("YYYY-MM-DD");
}

export function Demo() {
  return "It's a demo!";
}

export function Shell() {
  return <PluginContainer slot="Right" />;
}

export default (container) => {
  try {
    if (container) {
      container.bind(Symbol.for("ReactRenderer")).toConstantValue(ReactDOM);
    }
  } catch (err) {
    console.log(err);
  }
};
