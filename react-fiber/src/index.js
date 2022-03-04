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
    props: {
      ...props,
      children: children.map((fiber) =>
        typeof fiber === "object"
          ? fiber
          : {
              type: "TEXT_ELEMENT",
              props: {
                nodeValue: fiber,
              },
            }
      ),
    },
  };
}

function createDom(fiber) {
  const { type } = fiber;
  const props = fiber.props || {};
  const { children, nodeValue = "" } = props || {};

  // create corresponding node
  let node;
  if (type === "TEXT_ELEMENT") {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
    children?.forEach((vnode) => node.appendChild(createDom(vnode)));
  }

  // add attributes to node
  const isProperty = (attr) => attr !== "children";
  Object.keys(props)
    .filter(isProperty)
    .forEach((attr) => (node[attr] = props[attr]));

  // set listener
  const isListener = (attr) => attr.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach((listener) => {
      const type = listener.toLowerCase().slice(2);
      node.removeEventListener(type, props[listener]);
      node.addEventListener(type, props[listener]);
    });

  return node;
}

function render(fiber, container) {
  const node = createDom(fiber);
  container.appendChild(node);
}
const Didact = {
  createElement,
};
/** @jsx Didact.createElement */
// jsx 转换后就是这样，我们要根据 `createElement` 的入参来构建 fiber(vnode)
// const vnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"));
const container = document.getElementById("root");
let props = { count: 0 };
const vnode = (
  <div>
    <h1>h1</h1>
    <h2>h2</h2>
    <div>{props.count}</div>
    <button
      onClick={() => {
        console.log(vnode);
        props.count += 1;
        // TODO: 发现更新无效
        // 因为 vnode 就是空的嘛
        render(vnode, container);
      }}
    >
      click
    </button>
  </div>
);
render(vnode, container);
