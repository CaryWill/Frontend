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
  const { children } = props || {};

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

let currentFiber = null;
function render(fiber, container) {
  const node = createDom(fiber);
  if (currentFiber) {
    // 因为我们一开始使用的是 appendChild 所以我们只需要使用 `lastChild`
    // 就可以获得容器里的所有内容了
    container.replaceChild(node, container.lastChild);
  } else {
    container.appendChild(node);
  }
  currentFiber = fiber;
}
const Didact = {
  createElement,
};
/** @jsx Didact.createElement */
// jsx 转换后就是这样，我们要根据 `createElement` 的入参来构建 fiber(vnode)
const container = document.getElementById("root");
let props = { count: 0 };
const vnode = (
  <div>
    <h1>h1</h1>
    <h2>h2</h2>
    <button
      onClick={() => {
        render(<div>new</div>, container);
      }}
    >
      click
    </button>
  </div>
);
render(vnode, container);
