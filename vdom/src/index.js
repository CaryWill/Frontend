import { init } from "../snabbdom-build/init.js";
import { h } from "../snabbdom-build/h.js";
import { classModule } from "../snabbdom-build/modules/class.js";
import { propsModule } from "../snabbdom-build/modules/props.js";
import { styleModule } from "../snabbdom-build/modules/style.js";
import { eventListenersModule } from "../snabbdom-build/modules/eventlisteners.js";

const patch = init([
  // patch node 的时候会利用到这些模块，来决定什么要 patch 什么不用
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

const container = document.getElementById("container");

const newVnode = h("ul#container", {}, [
  h("li", { key: "a" }, "li a"),
  h("li", { key: "1" }, "li 1"),
  h("li", { key: "3" }, "li 3"),
  h("li", { key: "b" }, "li b"),
]);

const vnode = h(
  "ul#container",
  {
    on: {
      click: () => patch(vnode, newVnode),
    },
  },
  [
    h("li", { key: "1" }, "li 1"),
    h("li", { key: "2" }, "li 2"),
    h("li", { key: "3" }, "li 3"),
  ]
);
patch(container, vnode);
