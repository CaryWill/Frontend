/** @jsx Didact.createElement */
// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列3
// vnode 包一层
let rootInstance = null;

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
} // 将之前的 createDom 放到实例化方法这


function instantiate(vnode) {
  const {
    type
  } = vnode;
  const props = vnode.props || {};
  const isDomElement = typeof type === "string";
  let childInstances = [];
  let dom;
  let publicInstance = null;

  if (isDomElement) {
    if (type === "TEXT_ELEMENT") {
      dom = document.createTextNode("");
    } else {
      dom = document.createElement(type);
    }

    const childElements = props.children || [];
    childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));
  } else {
    const instance = new type(props);
    publicInstance = instance;
    element = instance.render();
    childInstances = [instantiate(element)];
    dom = childInstances[0].dom;
  } // set listener


  const isListener = attr => attr.startsWith("on");

  Object.keys(props).filter(isListener).forEach(listener => {
    const type = listener.toLowerCase().slice(2);
    dom.addEventListener(type, props[listener]);
  }); // add attributes to node

  const isProperty = attr => attr !== "children" && !isListener(attr);

  Object.keys(props).filter(isProperty).forEach(attr => dom[attr] = props[attr]);
  const fiber = {
    dom,
    element,
    childInstances,
    publicInstance
  };
  return fiber;
}

function render(vnode, parentDom) {
  // 如果我们需要 patch 的话，那么就需要上一次渲染的时候实例身上的 `dom` 属性
  // 因为我们要 patch 新的 vnode，我们如果将其包一层的话，那么新的 vnode
  // 实例身上的 `dom` 和原来的是不一样的
  // 我们需要将 `createDom` 重构，来 diff 新的 vnode 和旧的 vnode 对应的实例
  console.log(vnode);
  let prevInstance = rootInstance;
  let nextInstance = instantiate(vnode);

  if (prevInstance) {
    parentDom.replaceChild(nextInstance.dom, prevInstance.dom);
  } else {
    parentDom.appendChild(nextInstance.dom);
  }

  rootInstance = nextInstance;
}

const Didact = {
  createElement
};
const container = document.getElementById("root");

class Component {
  constructor(props) {
    this.props = props;
    this.state = this.state || {};
  }

  setState = partialState => {
    this.state = { ...this.state,
      ...partialState
    };
  };
}

Didact.Component = Component;

class App extends Didact.Component {
  state = {
    time: new Date().toString()
  };

  render() {
    return Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"), Didact.createElement("div", null, this.state.time), Didact.createElement("button", {
      onClick: () => {
        this.setState({
          time: new Date().toString()
        }); // 重构了下，这样我们可以将之前传下来的 `props.update` 的方式
        // 替换为直接获取 root vnode 对应的 dom 节点

        console.log(rootInstance.element);
        render(rootInstance.element, container);
      }
    }, "click"));
  }

}

class Container extends Didact.Component {
  render() {
    return Didact.createElement("div", null, Didact.createElement("div", null, "Note:"), Didact.createElement(App, null));
  }

}

render(Didact.createElement(Container, null), container);