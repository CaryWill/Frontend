// @jsx Didact.createElement
// NOTE: 上面这一行告诉 Babel 使用我们定义的 `createElement` 来创建 vnode(element)
// 参考文章：
// 1. https://engineering.hexacta.com/didact-instances-reconciliation-and-virtual-dom-9316d650f1d0

// NOTE: 为了和 React 对齐，这里用
// `element` 表示 vnode，下面可能会互用
// `dom` 表示原生 dom node

const TEXT_ELEMENT = "TEXT_ELEMENT";
// 构建 vnode
function createElement(type, _props, ..._children) {
  // props 如果为空的话 babel 会给你一个 null
  // 这里做下处理让 props 永远为 object
  const props = { ..._props };
  // 入参里的 props 参数之后的所有参数都是 child element
  // 这里统一将那么 child element 整合到 `props.children`
  // 并且如果 child element 是 text node 的话，就是一个字符串
  // 我们需要将其转换成 element（vnode）的格式
  // 比如，<div>123</div> 会转成下面的
  // React.createElement("div", null, "123")
  // 比如，<div>123<div>345</div></div> 会转成下面的
  // const ele = React.createElement("div", null, "123", React.createElement("div", null, "345"));
  const children = _children.map(function normalize(child) {
    if (typeof child === "object") {
      // element
      return child;
    } else {
      // string(not an element), needs convert to element
      return {
        type: TEXT_ELEMENT,
        props: {
          nodeValue: child,
          children: [],
        },
      };
    }
  });
  return { type, props: { ...props, children } };
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isListener = (attr) => attr.startsWith("on");
  const isProperty = (attr) => attr !== "children" && !isListener(attr);

  // 移除重新添加为了试 demo 更加简洁
  // remove props
  Object.keys(prevProps)
    .filter(isProperty)
    .forEach((key) => (dom[key] = null));
  // remove event listener
  Object.keys(prevProps)
    .filter(isListener)
    .forEach((key) => {
      const eventType = key.toLowerCase().slice(2);
      dom.removeEventListener(eventType, prevProps[key]);
    });

  // add props
  Object.keys(nextProps)
    .filter(isProperty)
    .forEach((key) => (dom[key] = nextProps[key]));
  // add event listener
  Object.keys(nextProps)
    .filter(isListener)
    .forEach((key) => {
      const eventType = key.toLowerCase().slice(2);
      dom.addEventListener(eventType, nextProps[key]);
    });
}

function instantiate(element) {
  const { type, props } = element;
  const { children } = props;
  const isTextElement = type === TEXT_ELEMENT;
  const isComponentElement = typeof type !== "string";
  let dom;

  if (isComponentElement) {
    let instance = {};
    const componentInstance = createComponentInstance(element, instance);
    // vnode(element)
    const childElement = componentInstance.render();
    const childInstance = instantiate(childElement);
    const dom = childInstance.dom;

    // 我们 diff 组件的话，需要 `childInstance`
    Object.assign(instance, { dom, element, componentInstance, childInstance });
    return instance;
  } else {
    // create dom
    if (isTextElement) {
      dom = document.createTextNode("");
    } else {
      dom = document.createElement(type);
    }

    updateDomProperties(dom, [], props);

    const childElements = children;
    const childInstances = childElements.map(instantiate);
    // render child nodes to dom
    childInstances.forEach((childInstance) =>
      dom.appendChild(childInstance.dom)
    );

    const instance = { dom, element, childInstances };

    // 这里引入了新的数据结构，`instance`，方便我们给 dom 做 patch
    // 而不是全量 vdom 的 diff，这里的 `instance` 为了和组件的 `component instance`
    // 做区别，会分别使用两个词来指代。
    return instance;
  }
}

function reconcileChildren(instance, element) {
  const prevInstance = instance;
  const prevChildInstances = prevInstance.childInstances;
  const parentDom = prevInstance.dom;
  // childInstances 里的每一项也都是 instance，
  // 所以直接使用 reconcile 就行
  const childElements = element.props.children;
  const nextChildInstances = [];

  const length = Math.max(prevChildInstances.length, childElements.length);

  for (let i = 0; i < length; i++) {
    const prevChildInstance = prevChildInstances[i];
    const childElement = childElements[i];

    // patch child dom
    // 因为有可能 prevChildInstances.length 比 childElements.length 长
    // 导致调用下面 `reconcile` 的时候 childElement 为 undefined
    // 也有可能反之，
    // prevChildInstance 为 undefined
    // 所以这两种情况也需要在 reconcile 中 cover 到
    nextChildInstances[i] = reconcile(
      parentDom,
      prevChildInstance,
      childElement
    );
  }

  // 因为有可能 element 被移除，所以同时需要过滤下
  return nextChildInstances.filter(Boolean);
}

// 用来存储上一个 instance 以便做 diff
let rootInstance = null;
function reconcile(parentDom, instance, element) {
  const prevInstance = instance;
  if (!prevInstance) {
    const newInstance = instantiate(element);
    parentDom.appendChild(newInstance.dom);
    return newInstance;
  } else if (!element) {
    parentDom.removeChild(prevInstance.dom);
    return null;
  } else if (prevInstance.element.type !== element.type) {
    // 替换 prevInstance
    const newInstance = instantiate(element);
    parentDom.replaceChild(newInstance.dom);
    return newInstance;
  } else if (typeof element.type === "string") {
    // 更新 prevInstance
    // 如果两个 element（vnode）是同种 tag 的
    // 那么我们更新 prevInstance 身上的 dom 属性/listener 就行了
    // 复用原有的 dom 节点性能更好

    // 更新 dom
    updateDomProperties(
      prevInstance.dom,
      prevInstance.element.props,
      element.props
    );
    // 更新 element
    prevInstance.element = element;
    // 上面只更新了当前 dom 节点的属性，dom 节点 children 的属性也需要更新下
    // 而 children 的 dom 你可以通过 diff prevInstance 身上的
    // `childInstances` 这个属性
    prevInstance.childInstances = reconcileChildren(prevInstance, element);
    return prevInstance;
  } else {
    // 如果 element 是组件的话
    // 更新组件实例
    // this.props
    prevInstance.componentInstance.props = element.props;
    const childElement = prevInstance.componentInstance.render();
    const prevChildInstance = prevInstance.childInstance;
    // diff 两个组件实例返回的 vdom
    // 如果只是更新组件的话，我们其实只需要该组件对应的 vnode instance 就行了
    // 然后将 vnode instance 身上的组件实例 `render()` 方法调用一下生成新的 vnode
    // 和 childInstance 里面的 `element` 旧 vnode 进行 reconcile 就行了
    const childInstance = reconcile(parentDom, prevChildInstance, childElement);

    prevInstance.dom = childInstance.dom;
    prevInstance.childInstance = childInstance;
    prevInstance.element = element;
    return prevInstance;
  }
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {}; // 实例有可能自己定义了
  }

  setState(partialState) {
    this.state = { ...this.state, ...partialState };
    // re-render and patch dom
    const componentVnodeInstance = this.__internalInstance;
    const parentDom = componentVnodeInstance.dom.parentNode;
    const element = componentVnodeInstance.element;
    reconcile(parentDom, componentVnodeInstance, element);
  }
}

// 实例化组件
function createComponentInstance(
  element,
  internalInstance // vnode 对应的实例，不是组件实例，我们需要获取 vnode 对应的实例身上的 `dom` 属性方便 patch
) {
  // 自定义 element 的话实例化组件
  const { type, props } = element;
  const componentInstance = new type(props);
  componentInstance.__internalInstance = internalInstance;
  return componentInstance;
}

function render(element, parentDom) {
  // render to dom
  let prevInstance = rootInstance;
  const nextInstance = reconcile(parentDom, prevInstance, element);
  rootInstance = nextInstance;
}

const Didact = { createElement, render, Component };

class Counter extends Didact.Component {
  state = { count: 1 };
  render() {
    return (
      <div>
        {this.state.count}
        <button
          onClick={() => {
            this.setState({ count: this.state.count + 1 });
          }}
        >
          click
        </button>
      </div>
    );
  }
}

const rootDom = document.getElementById("root");
function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = (
    <div>
      <span>Date: </span>
      <h1>{time}</h1>
      <Counter />
    </div>
  );

  // 之前的做法太暴力，没有 diff，每次渲染更新都是销毁重建 dom 性能较差
  // 如果我们可以记录下上一个 vdom，这样我们可以比较旧的 vdom 和更新
  // vnode（element）的时候生成的新的 vdom，找出需要更新的 vnode
  // 然后对 dom 进行 patch，所以我们需要引入一个新的概念 **instance**
  // 里面有和 dom 一一对应的 `element` 属性，方便 diff 新旧 vnode，
  // 以及有和 element 一一对应的 `dom` 属性，方便直接 `dom.parentNode`
  // 进行直接 patch dom，以及 `childInstances` 来表示 childVnodes
  // 所对应的 instances。注意一下，这里的 instance 不是指组件的实例。
  // 尽量复用 instance 将有助于减少对 dom 的修改从而提升性能

  // (re)render
  // 之前的做法还存在问题，
  // diff 虽然做了，但是每次的 diff 都是全量的 diff
  render(clockElement, rootDom);
}

tick();
// setInterval(tick, 1000);
