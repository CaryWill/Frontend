/** @jsx Didact.createElement */
// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列 4
// 上一回我们重构了 rerender 的逻辑，使用了一个变量存 root vnode 实例
// 这次的目标是只 patch 变动的 vnode 的部分来 reuse dom
// 感觉先从实例开讲有点困难 // 后面 diff 的过程串不起来

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

function updateDomProperties(dom, prevProps, nextProps) {
  const isListener = (attr) => attr.startsWith("on");
  const isProperty = (attr) => attr !== "children" && !isListener(attr);

  // TODO: remove listeners/properties

  // set listener
  Object.keys(nextProps)
    .filter(isListener)
    .forEach((listener) => {
      const type = listener.toLowerCase().slice(2);
      dom.addEventListener(type, nextProps[listener]);
    });

  // add attributes to node
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((attr) => (dom[attr] = nextProps[attr]));
}

function instantiate(vnode) {
  const { type, props } = vnode;
  const isDomElement = typeof type === "string";

  if (isDomElement) {
    const dom =
      type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(type);

    const childVnodes = props.children || [];
    const childInstances = childVnodes.map(instantiate);
    const childDoms = childInstances.map((childInstance) => childInstance.dom);
    childDoms.forEach((childDom) => dom.appendChild(childDom));

    updateDomProperties(dom, [], props);

    const fiber = { dom, element: vnode, childInstances };
    return fiber;
  } else {
    const instance = new type(props);
    const element = instance.render();
    const childInstance = instantiate(element);
    const fiber = { dom: childInstance.dom, element, instance, childInstance };
    return fiber;
  }
}

function reconcileChildren(prevInstance, vnode) {
  const { dom: parentDom, childInstances: prevChildInstances } = prevInstance;
  const nextChildVnodes = vnode.props.children || [];
  const length = Math.max(prevChildInstances.length, nextChildVnodes.length);
  const nextChildInstances = [];
  for (let i = 0; i < length; i++) {
    nextChildInstances[i] = reconcile(
      parentDom,
      prevChildInstances[i],
      nextChildVnodes[i]
    );
  }
  return nextChildInstances;
}

function reconcile(parentDom, prevInstance, vnode) {
  debugger;
  let nextInstance;
  // 目标是尽量 reuse dom 来提升性能
  if (!prevInstance) {
    nextInstance = instantiate(vnode);
    parentDom.appendChild(nextInstance.dom);
  } else if (!vnode) {
    parentDom.removeChild(prevInstance.dom);
    nextInstance = null;
  } else if (prevInstance.element.type !== vnode.type) {
    // 组件不相同
    nextInstance = instantiate(vnode);
    parentDom.replaceChild(nextInstance.dom, prevInstance.dom);
  } else if (typeof vnode.type === "string") {
    // 组件返回的 vnode 和 新的 vnode 的 type 进行对比
    // 虽然两个不同的组件返回的 vnode 也有可能是一样的，但是问题不大
    // 我们直接复用就行
    // TODO: 直接复用会有问题吗

    // 更新组件的 props
    updateDomProperties(
      prevInstance.dom,
      prevInstance.element.props,
      vnode.props
    );
    console.log(prevInstance);
    // 更新 prevInstance.dom
    prevInstance.childInstances = reconcileChildren(prevInstance, vnode);
    // 更新 prevInstance.element
    prevInstance.element = vnode;
    // 复用之前的 instance
  } else {
    // 复合组件
    const { instance } = vnode;
    const element = instance.render();
    const childInstance = reconcile(parentDom, prevInstance, element);
    prevInstance.dom = childInstance.dom;
    prevInstance.childInstance = childInstance;
    instance.element = element;
  }

  return nextInstance;
}

let rootInstance = null;
function render(vnode, container) {
  let prevInstance = rootInstance;
  let nextInstance = reconcile(container, prevInstance, vnode);
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
    // reuse dom
    reconcile(container, rootInstance, rootInstance.instance.render());
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
