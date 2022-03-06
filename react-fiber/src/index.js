/** @jsx Didact.createElement */
// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列2

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

let
function instantiate(vnode) {
  const { type } = vnode;
  const props = vnode.props || {};
  const { children } = props || {};

  // create corresponding node
  let node;
  if (typeof type !== "string") {
    // 组件
    const instance = new type(props);
    const element = instance.render();
    node = instantiate(element);
    instance.__internalInstance = { dom: node, element };
  } else if (type === "TEXT_ELEMENT") {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
    children?.forEach((vnode) => node.appendChild(instantiate(vnode)));
  }

  // set listener
  const isListener = (attr) => attr.startsWith("on");
  Object.keys(props)
    .filter(isListener)
    .forEach((listener) => {
      const type = listener.toLowerCase().slice(2);
      node.addEventListener(type, props[listener]);
    });

  // add attributes to node
  const isProperty = (attr) => attr !== "children" && !isListener(attr);
  Object.keys(props)
    .filter(isProperty)
    .forEach((attr) => (node[attr] = props[attr]));

  return node;
}

function render(vnode, container) {
  const node = instantiate(vnode);
  if (container.lastChild) {
    // 因为我们一开始使用的是 appendChild 所以我们只需要使用 `lastChild`
    // 就可以获得容器里的所有内容了
    container.replaceChild(node, container.lastChild);
  } else {
    container.appendChild(node);
  }
}
const Didact = {
  createElement,
};
const container = document.getElementById("root");

/**
 * 为什么需要重新创建一个 vnode 来更新的例子
  const state = { count: 1 };
  const count = state.count;
  const getCount = () => state.count;
  console.log(count); // 1
  console.log(getCount()); // 1
  state.count += 1;
  console.log(count); // 1 // 不是 2
  console.log(state.count); // 2
  console.log(getCount()); // 2
* 为了支持状态 我们需要引入函数动态生成 vnode
 */

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState = (partialState) => {
    this.state = { ...this.state, ...partialState };
    updateInstance(this.__internalInstance);
  };
}

function updateInstance(instance) {
  const parentDom = instance.dom.parentNode;
  const vnode = instance.element;
  render(vnode, parentDom);
}

Didact.Component = Component;

class App extends Didact.Component {
  state = { time: new Date().toString() };

  render() {
    return (
      <div>
        <h1>h1</h1>
        <h2>h2</h2>
        <div>{this.state.time}</div>
        <button
          onClick={() => {
            this.setState({ time: new Date().toString() });
          }}
        >
          click
        </button>
      </div>
    );
  }
}

class Container extends Didact.Component {
  render() {
    return (
      <div>
        <div>Note:</div>
        <App />
      </div>
    );
  }
}

render(<Container />, container);
