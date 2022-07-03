import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import { PluginContainer } from './ShellApp/PluginContainer.tsx';

export function App() {
  return moment(new Date()).format("YYYY-MM-DD");
}

export function Demo() {
  return "It's a demo!";
}

export function Shell() {
  return <PluginContainer slot="Right" />;
}

// 当前模块被加载完成后，此函数会被执行
// 来注册 ReactRenderer 服务提供渲染能力
export default (container) => {
  try {
    if (container) {
      container.bind(Symbol.for("ReactRenderer")).toConstantValue(ReactDOM);
    }
  } catch (err) {
    console.log(err);
  }
};
