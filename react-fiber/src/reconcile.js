/** @jsx Didact.createElement */

// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列3

// vnode 包一层
let rootInstance = null;
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

// 将之前的 createDom 放到实例化方法这
function instantiate(vnode) {
  const { type } = vnode;
  const props = vnode.props || {};
  const isDomElement = typeof type === "string";
  let childInstances = [];
  let dom;

  if (isDomElement) {
    if (type === "TEXT_ELEMENT") {
      dom = document.createTextNode("");
    } else {
      dom = document.createElement(type);
    }

    const childElements = props.children || [];
    childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map((childInstance) => childInstance.dom);
    childDoms.forEach((childDom) => dom.appendChild(childDom));
  } else {
    const instance = new type(props);
    element = instance.render();
    childInstances = [instantiate(element)];
    dom = childInstances[0].dom;
  }
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

  const fiber = { dom, element, childInstances };
  return fiber;
}

function render(vnode, parentDom) {
  let prevInstance = rootInstance;
  let nextInstance = instantiate(vnode);
  if (prevInstance) {
    parentDom.replaceChild(nextInstance.dom, prevInstance.dom);
  } else {
    parentDom.appendChild(nextInstance.dom);
  }
  rootInstance = nextInstance;
}

function updateInstance() {

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
    // 而且我们还需要每次的调用更新的方法，我们可以将其移动到 `this.setState` 方法里面
    updateInstance(this)
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
