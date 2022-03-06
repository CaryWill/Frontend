/** @jsx Didact.createElement */
// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列 3
// 将 `props.update` 替换为 全局变量记录 root vnode 的形式

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((vnode) =>
        typeof vnode === "object"
          ? vnode
          : {
              type: "TEXT_ELEMENT",
              props: {
                nodeValue: vnode,
              },
            }
      ),
    },
  };
}

function instantiate(vnode) {
  const { type, props } = vnode;
  const isDomElement = typeof type === "string";
  const fiber = {};

  if (isDomElement) {
    const dom =
      type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);

    const childVnodes = props.children || [];
    const childInstances = childVnodes.map(instantiate);
    const childDoms = childInstances.map((childInstance) => childInstance.dom);
    childDoms.forEach((childDom) => dom.appendChild(childDom));

    // set listener
    const isListener = (attr) => attr.startsWith("on");
    Object.keys(props)
      .filter(isListener)
      .forEach((listener) => {
        const type = listener.toLowerCase().slice(2);
        dom.addEventListener(type, props[listener]);
      });

    // add attributes to node
    const isProperty = (attr) => attr !== "children" && !isListener(attr);
    Object.keys(props)
      .filter(isProperty)
      .forEach((attr) => (dom[attr] = props[attr]));

    fiber.dom = dom;
    fiber.element = vnode;
  } else {
    const instance = new type(props);
    const element = instance.render();
    fiber.dom = instantiate(element).dom;
    fiber.element = element;
    fiber.instance = instance;
  }

  return fiber;
}

let rootInstance = null;
function render(vnode, container) {
  let prevInstance = rootInstance;
  let nextInstance = instantiate(vnode);
  if (prevInstance) {
    container.replaceChild(nextInstance.dom, container.lastChild);
  } else {
    container.appendChild(nextInstance.dom);
  }
  rootInstance = nextInstance;
}
const Didact = {
  createElement,
};
const container = document.getElementById("root");

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState = (partialState) => {
    this.state = { ...this.state, ...partialState };
    // 虽然现在不用我们每次手动调用父组件的 render 了
    // 但是现在还有一个问题，就是每次渲染
    container.replaceChild(
      instantiate(rootInstance.instance.render()).dom,
      container.lastChild
    );
  };
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
