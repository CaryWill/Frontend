// @jsx Didact.createElement
// NOTE: 上面这一行告诉 Babel 使用我们定义的 `createElement` 来创建 vnode(element)

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

  const rawChildren = _children;
  // 支持 `render()` 返回数组
  // 正常多个 child 的话，会是 [{type: 'tr', props:{}},type: 'tr', props:{}}]
  // 但是返回数组的话就变成了，[[{type: 'tr', props:{}},type: 'tr', props:{}}]]
  const _rawChildren = [].concat(...rawChildren);

  console.log(
    "a",
    _children,
    "b",
    _rawChildren.filter((c) => c != null && c !== false)
  );

  const children = _rawChildren
    .filter((c) => c != null && c !== false) // null 和 false 值 不渲染
    .map(function normalize(child) {
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

// Effect tags
function reconcileChildren(fiber, newChildElements) {
  const elements = Array.isArray(newChildElements)
    ? newChildElements
    : [newChildElements];

  let oldFiber = fiber.alternate?.child;
  let prevSibling = null;
  // wipFiber.alternate.child (也就是 oldFiber) 链表形式
  // 和 newChildElement 数组是一一对应的
  // 所以如果 elements[index] 有值，oldFiber 无值
  // 说明新增了 一些 elements，反之，删除了一些 elements
  for (let index = 0; index < elements.length || oldFiber; index++) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && oldFiber.type === element.type;

    if (sameType) {
      // 组件相同，那么复用原来的组件
      // 而且 element 身上只有 type 和 props 两个属性
      newFiber = {
        type: element.type,
        props: element.props, // 会有 children
        stateNode: oldFiber.stateNode,
        parent: fiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
        partialState: oldFiber.partialState, // 还记得我们在 scheduleUpdate 的时候拷贝的 partialState 吗
      };
    } else {
      // 销毁新增或者只新增或者只销毁
      if (element) {
        // 新增
        newFiber = {
          type: element.type,
          props: element.props,
          parent: fiber,
          effectTag: "PLACEMENT",
          stateNode: null,
          alternate: null,
        };
      }

      if (oldFiber) {
        // 删除
        // 注意这个是 旧的 fiber
        oldFiber.effectTag = "DELETION";
        deletions.push(oldFiber);
      }
    }

    // 将 newFiber 关联到 wipFiber 上建立链表
    if (index === 0) {
      fiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    if (oldFiber) {
      // 继续链表里的下一个 oldFiber
      oldFiber = oldFiber.sibling;
    }
    prevSibling = newFiber;
  }
}

function updateClassComponent(fiber) {
  // 如果是 class 组件的话，那么 stateNode 表示组件实例
  // 如果是 dom 元素的话，那么 stateNode 表示 dom 节点
  let instance = fiber.stateNode;

  if (!instance) {
    instance = createComponentInstance(fiber);
    fiber.stateNode = instance;
  } else {
    // TODO: props 和 state 没变的话，可以做一个优化
    // clone and return
  }

  // 更新组件
  instance.props = fiber.props;
  instance.state = Object.assign({}, instance.state, fiber.partialState);
  fiber.partialState = null;

  // 根据新的 state 和 props 生成新的组件返回值（children）
  const newChildElements = instance.render();
  // 为每一个 child 创建一个 fiber 并且和链表到 wipFiber
  reconcileChildren(fiber, newChildElements);
}

function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, [], fiber.props);
  return dom;
}

function updateHostComponent(fiber) {
  const dom = fiber.stateNode;
  if (!dom) {
    fiber.stateNode = createDomElement(fiber);
  }
  const newChildElements = fiber.props.children;
  reconcileChildren(fiber, newChildElements);
}

let wipFiber = null; // 我们可以在 useState 等 hooks 里知道当前组件对应的 fiber 是哪一个
let hookIndex = null;
function updateFunctionComponent(fiber) {
  // 我们将 hooks 保存到 fiber 上
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];

  // diff children 的话，还是一样
  // 只不过 function 组件需要调用下自己来生成最新的 children elements 再进行 diff
  const newChildElements = [fiber.type(fiber.props)];
  console.log(newChildElements);
  reconcileChildren(fiber, newChildElements);
}

// 我们在 function 组件被初始化的时候，调用 useState 等 hooks
// 我们可以直接拿到当前组件对应的 fiber 也就是全局变量 wipFiber 了
function useState(initialState) {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initialState,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    // 和 render(element, container) 一样的逻辑
    wipRoot = {
      stateNode: currentRoot.stateNode,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex = 0;
  return [hook.state, setState];
}

function beginWork(fiber) {
  // 更新 fiber 根 children 之间建立链表
  const isComponent = fiber?.type instanceof Function;
  const isClassComponent = fiber?.type?.prototype?.isReactComponent;
  if (isComponent) {
    if (isClassComponent) {
      updateClassComponent(fiber);
    } else {
      updateFunctionComponent(fiber);
    }
  } else {
    updateHostComponent(fiber);
  }
}

// diff 单个 fiber
// diff 该 fiber 的 children，并通过链表和 fiber 进行关联
function performUnitOfWork(fiber) {
  beginWork(fiber);

  // 返回下一个 fiber(next unit of work)
  if (fiber.child) {
    // 说明当前 wipFiber 是有 children 的
    return fiber.child;
  } else {
    // 虽然 wipFiber 没有 children 但是它可能有 sibling
    let nextFiber = fiber;
    while (nextFiber) {
      // 一个 child work diff 完成因为它没有 children 可以
      // diff 了
      // child -> sibling -> uncle(child.parent.sibling)
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      } else {
        // uncle
        nextFiber = nextFiber.parent;
        // 继续 loop parent.sibling
      }
    }
  }
}

let nextUnitOfWork = null;
let currentRoot = null; // 上个 commit 的 fiber root
let wipRoot = null; // 当前 diff 完成的 fiber root
let deletions = null;
const ENOUGH_TIME = 1; // milliseconds

function commitDeletion(fiber, domParent) {
  if (!domParent) {
    let parentFiber = fiber.parent;
    const isComponent = (f) => f?.type instanceof Function;
    while (isComponent(parentFiber)) {
      parentFiber = parentFiber.parent;
    }
    commitDeletion(fiber, parentFiber.stateNode);
    return;
  }

  if (fiber.stateNode) {
    if (fiber?.type && typeof fiber?.type === "string") {
      domParent.removeChild(fiber.stateNode);
    }
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// 打了 effectTag 的 fiber 就是一个 effect
const commitWork = (fiber) => {
  if (!fiber) return;

  let parentFiber = fiber.parent;
  // 如果是组件的话，那么得 traverse parent 直到找到 dom 元素
  const isComponent = (f) => f?.type instanceof Function;
  while (isComponent(parentFiber)) {
    parentFiber = parentFiber.parent;
  }

  const parentDom = parentFiber.stateNode;
  if (fiber.effectTag === "PLACEMENT" && fiber.stateNode) {
    if (!isComponent(fiber)) {
      parentDom.appendChild(fiber.stateNode);
    }
  } else if (fiber.effectTag === "UPDATE" && fiber.stateNode) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, parentDom);
  }

  // 递归 fiber 的 child 和 sibling
  // 所以当 child 或 sibling 没有的话 我们直接 return 了
  // commit phase 只能是递归的，我们得保持界面渲染是正确的
  // 而不是渲染了一半
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

function commitRoot() {
  // 因为我们是根据 wipRoot 的链表来处理带有 effectTag 的
  // fiber，所以 wipRoot 里是没有被删除了的 fiber node
  // 的，所以我们需要一个数组来保存这些需要被删除的 fiber nodes
  // 原作者那边删除的时候，处理的有问题 deletions.forEach(commitWork) 不大行
  deletions.forEach((fiber) => commitDeletion(fiber));
  // 从第一个 child 开始 patch
  commitWork(wipRoot.child);
  // patch 结束 wipRoot 变成 旧 fiber root
  currentRoot = wipRoot;
  wipRoot = null;
}

function workLoop(deadline) {
  // 是否应该产出任务来继续下一个任务的 diff
  let shouldYield = true;
  while (nextUnitOfWork && shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() > ENOUGH_TIME;
  }

  // Render phase 结束：所有 update 的 diff 都已完成
  // 进入 Commit phase
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // 我们要让它 一直跑 这样我们直接设置 nextUnitOfWork
  // 就会自动 diff 了
  requestIdleCallback(workLoop);
}

function scheduleUpdate(instance, partialState) {
  const getFiberRoot = (_fiber) => {
    let fiberRoot = _fiber;
    while (fiberRoot.parent) {
      fiberRoot = fiberRoot.parent;
    }
    return fiberRoot;
  };
  const root = getFiberRoot(instance.__fiber);

  wipRoot = {
    stateNode: root,
    props: root?.props,
    type: root?.type,
    alternate: root,
  };
  // component
  // 将 update.partialState 拷到 intance.__fiber 身上
  // 而不是直接在 setState 的时候直接更新 this.state
  // 是因为我们可以在后面 diff 的时候看 this.state
  // 和 update.partialState 对比，看是否需要重新渲染
  // 来做一个优化，毕竟只有 props 或者 state 改变了才会重新渲染
  instance.__fiber.partialState = partialState;
  nextUnitOfWork = wipRoot;
  deletions = [];
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {}; // 实例有可能自己定义了
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}
// 用来判断是 class 组件还是 function 组件
Component.prototype.isReactComponent = {};

// 实例化组件
function createComponentInstance(fiber) {
  const { type, props } = fiber;
  const componentInstance = new type(props);
  componentInstance.__fiber = fiber;
  return componentInstance;
}

// 更新的话 都是 fiber 和 element 进行对比
function render(element, container) {
  // Step1: discard 之前的 diff
  // 进行下一个 diff
  wipRoot = {
    stateNode: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  // 一个 fiber 的 diff 是一个 work
  // 我们设置了 nextUnitOfWork 就行了
  // 它会自动 diff，因为我们在 workLoop 函数里设置了
  // 无限 diff
  nextUnitOfWork = wipRoot;
  deletions = [];
}
// 用 Didact.render 的时候，直接跑 diff
requestIdleCallback(workLoop);

export const Didact = { createElement, render, Component, useState };
