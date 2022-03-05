// 系列1
// 最基础的 react 版本
// 渲染和更新
// 缺点：
// 1. 更新的时候需要重新自己生成一个完整的 vnode 用来渲染
// 2. 更新的时候是全替的，重新生成一个完整的 dom 是是否影响性能的
// vnode 结构如下，在 react 里 vnode 被称为 fiber，
// {
//   type: 'div',
//   props: {
//     children: [
//       {
//         type: 'h1',
//         props: {}
//       },
//       {
//         type: 'h2',
//         props: {}
//       }
//     ]
//   }
// }
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props,
      children: children.map(fiber => typeof fiber === "object" ? fiber : {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: fiber
        }
      })
    }
  };
}

function createDom(fiber) {
  const {
    type
  } = fiber;
  const props = fiber.props || {};
  const {
    children
  } = props || {}; // create corresponding node

  let node;

  if (type === "TEXT_ELEMENT") {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
    children?.forEach(vnode => node.appendChild(createDom(vnode)));
  } // set listener


  const isListener = attr => attr.startsWith("on");

  Object.keys(props).filter(isListener).forEach(listener => {
    const type = listener.toLowerCase().slice(2);
    node.removeEventListener(type, props[listener]);
    node.addEventListener(type, props[listener]);
  }); // add attributes to node

  const isProperty = attr => attr !== "children" && !isListener(attr);

  Object.keys(props).filter(isProperty).forEach(attr => node[attr] = props[attr]);
  return node;
}

function render(fiber, container) {
  const node = createDom(fiber);

  if (container.lastChild) {
    // 因为我们一开始使用的是 appendChild 所以我们只需要使用 `lastChild`
    // 就可以获得容器里的所有内容了
    container.replaceChild(node, container.lastChild);
  } else {
    container.appendChild(node);
  }
}

const Didact = {
  createElement
};
/** @jsx Didact.createElement */
// jsx 转换后就是这样，我们要根据 `createElement` 的入参来构建 fiber(vnode)

const container = document.getElementById("root");
const vnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"), Didact.createElement("div", null, new Date().toString()), Didact.createElement("button", {
  onClick: () => {
    const newVnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"), Didact.createElement("div", null, new Date().toString()), Didact.createElement("button", null, "click"));
    render(newVnode, container);
  }
}, "click"));
render(vnode, container);