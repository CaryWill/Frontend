// @jsx Didact.createElement
// NOTE: 上面这一行告诉 Babel 使用我们定义的 `createElement` 来创建 vnode(element)
// 参考文章：
// 1. https://engineering.hexacta.com/didact-instances-reconciliation-and-virtual-dom-9316d650f1d0
// 2. https://codepen.io/carywill/pen/Exojaeg?editors=0010
// https://pomber.github.io/incremental-rendering-demo/didact.bundle.js?19b2eab298e44d7e7856
// https://pomber.github.io/incremental-rendering-demo/didact.html
// https://codepen.io/yashbhardwaj/pen/wvzzeV
// fiber
// let fiber = {
//   tag: HOST_COMPONENT,
//   type: "div",
//   parent: parentFiber, `parent`, `child`, `sibling` 用来组成 fiber tree 链表
//   child: childFiber,
//   sibling: null,
//   alternate: currentFiber,
//   stateNode: document.createElement("div"),
//   props: { children: [], className: "foo"},
//   partialState: null,
//   effectTag: PLACEMENT,
//   effects: []
// };
const TEXT_ELEMENT = "TEXT_ELEMENT"; // 构建 vnode

function createElement(type, _props, ..._children) {
  // props 如果为空的话 babel 会给你一个 null
  // 这里做下处理让 props 永远为 object
  const props = { ..._props
  }; // 入参里的 props 参数之后的所有参数都是 child element
  // 这里统一将那么 child element 整合到 `props.children`
  // 并且如果 child element 是 text node 的话，就是一个字符串
  // 我们需要将其转换成 element（vnode）的格式
  // 比如，<div>123</div> 会转成下面的
  // React.createElement("div", null, "123")
  // 比如，<div>123<div>345</div></div> 会转成下面的
  // const ele = React.createElement("div", null, "123", React.createElement("div", null, "345"));

  const rawChildren = _children; // 支持 `render()` 返回数组
  // 正常多个 child 的话，会是 [{type: 'tr', props:{}},type: 'tr', props:{}}]
  // 但是返回数组的话就变成了，[[{type: 'tr', props:{}},type: 'tr', props:{}}]]

  const _rawChildren = [].concat(...rawChildren);

  const children = _rawChildren.filter(c => c != null && c !== false) // null 和 false 值 不渲染
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
          children: []
        }
      };
    }
  });

  return {
    type,
    props: { ...props,
      children
    }
  };
}

function updateDomProperties(dom, prevProps, nextProps) {
  const isListener = attr => attr.startsWith("on");

  const isProperty = attr => attr !== "children" && !isListener(attr); // 移除重新添加为了试 demo 更加简洁
  // remove props


  Object.keys(prevProps).filter(isProperty).forEach(key => dom[key] = null); // remove event listener

  Object.keys(prevProps).filter(isListener).forEach(key => {
    const eventType = key.toLowerCase().slice(2);
    dom.removeEventListener(eventType, prevProps[key]);
  }); // add props

  Object.keys(nextProps).filter(isProperty).forEach(key => dom[key] = nextProps[key]); // add event listener

  Object.keys(nextProps).filter(isListener).forEach(key => {
    const eventType = key.toLowerCase().slice(2);
    dom.addEventListener(eventType, nextProps[key]);
  });
} // Effect tags


const PLACEMENT = 1;
const DELETION = 2;
const UPDATE = 3;

function reconcileChildrenArray(wipFiber, newChildElements) {
  const elements = Array.isArray(newChildElements) ? newChildElements : [newChildElements];
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null; // wipFiber.alternate.child (也就是 oldFiber) 链表形式
  // 和 newChildElement 数组是一一对应的
  // 所以如果 elements[index] 有值，oldFiber 无值
  // 说明新增了 一些 elements，反之，删除了一些 elements

  for (let index = 0; index < elements.length || oldFiber; oldFiber = oldFiber?.sibling, // 继续链表里的下一个 oldFiber
  index++) {
    const element = elements[index];
    let newFiber = null;
    const sameType = oldFiber && element && oldFiber.type === element.type;

    if (sameType) {
      // 组件相同，那么复用原来的组件
      // 而且 element 身上只有 type 和 props 两个属性
      newFiber = {
        type: element.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        // 可能会有 children
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        // 还记得我们在 scheduleUpdate 的时候拷贝的 partialState 吗
        effectTag: UPDATE
      };
    } else {
      // 销毁新增或者只新增或者只销毁
      if (element) {
        // 新增
        newFiber = {
          type: element.type,
          tag: typeof element.type === "string" ? HOST_COMPONENT : CLASS_COMPONENT,
          props: element.props,
          parent: wipFiber,
          effectTag: PLACEMENT
        };
      }

      if (oldFiber) {
        // 删除
        // 注意这个是 旧的 fiber
        oldFiber.effectTag = DELETION;
        wipFiber.effects = wipFiber.effects || [];
        wipFiber.effects.push(oldFiber);
      }
    } // 将 newFiber 关联到 wipFiber 上建立链表


    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
  }
}

function updateClassComponent(wipFiber) {
  // 如果是 class 组件的话，那么 stateNode 表示组件实例
  // 如果是 dom 元素的话，那么 stateNode 表示 dom 节点
  let instance = wipFiber.stateNode;

  if (!instance) {
    instance = createComponentInstance(wipFiber);
    wipFiber.stateNode = instance;
  } else {// TODO: props 和 state 没变的话，可以做一个优化
    // clone and return
  } // 更新组件


  instance.props = wipFiber.props;
  instance.state = Object.assign({}, instance.state, wipFiber.partialState);
  wipFiber.partialState = null; // 根据新的 state 和 props 生成新的组件返回值（children）

  const newChildElements = wipFiber.stateNode.render(); // 为每一个 child 创建一个 fiber 并且和链表到 wipFiber
  // TODO: 组件 `render` 函数暂时不支持返回数组

  reconcileChildrenArray(wipFiber, newChildElements);
}

function completeWork(fiber) {
  // 该 fiber diff 完成
  // 需要将 fiber 身上有 effect tag 的 fiber 聚集
  // 到 fiber.parent 身上，这样到最后 wipRoot 身上就会
  // 有所有的子 fiber 身上的 effects
  // 更新组件身上的 fiber 对象
  // 如果有多个 update 的话，需要保证组件身上的 fiber 是最新的
  if (fiber.tag == CLASS_COMPONENT) {
    fiber.stateNode.__fiber = fiber;
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [];
    const selfEffect = fiber.effectTag ? [fiber] : [];
    fiber.parent.effects = fiber.parent.effects || [];
    fiber.parent.effects = [...fiber.parent.effects, ...selfEffect, ...childEffects];
  } else {
    // fiber root, a.k.a wipRoot
    // diff 完毕进入 commit phase
    pendingCommit = fiber;
  }
}

function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const dom = isTextElement ? document.createTextNode("") : document.createElement(fiber.type);
  updateDomProperties(dom, [], fiber.props);
  return dom;
}

function updateHostComponent(wipFiber) {
  const dom = wipFiber.stateNode;

  if (!dom) {
    wipFiber.stateNode = createDomElement(wipFiber);
  }

  const newChildElements = wipFiber.props.children;
  reconcileChildrenArray(wipFiber, newChildElements);
} // diff 单个 fiber
// diff 该 fiber 的 children，并通过链表和 fiber 进行关联


function performNextUnitOfWork(wipFiber) {
  // 更新 fiber 根 children 之间建立链表
  if (wipFiber.tag === CLASS_COMPONENT) {
    updateClassComponent(wipFiber);
  } else {
    updateHostComponent(wipFiber);
  } // 返回下一个 fiber(next unit of work)


  if (wipFiber.child) {
    // 说明当前 wipFiber 是有 children 的
    return wipFiber.child;
  } else {
    // 虽然 wipFiber 没有 children 但是它可能有 sibling
    let unitOfWork = wipFiber;

    while (unitOfWork) {
      // 一个 child work diff 完成因为它没有 children 可以
      // diff 了
      completeWork(unitOfWork); // child -> sibling -> uncle(child.parent.sibling)

      if (unitOfWork.sibling) {
        return unitOfWork.sibling;
      } else {
        // uncle
        unitOfWork = unitOfWork.parent; // 继续 loop parent.sibling
      }
    }
  }
}

let nextUnitOfWork = null;
let currentRoot = null; // 上个 commit 的 fiber root

let wipRoot = null; // 正在 diff 的 fiber root

const updateQueue = []; // setState, render 等触发一个任务

let pendingCommit = null; // 当前 diff 完成的 update

const ENOUGH_TIME = 1; // milliseconds
// Step3. 1
// 如果当前没有任务的话 `nextUnitOfWork` 那么
// 从 `updateQueue` dequeue 一个出来

function kickStartWorkLoop() {
  const update = updateQueue.shift();

  if (!update) {
    return;
  }

  const getFiberRoot = _fiber => {
    let fiberRoot = _fiber;

    while (fiberRoot.parent) {
      fiberRoot = fiberRoot.parent;
    }

    return fiberRoot;
  };

  const root = update.from === HOST_ROOT ? currentRoot : getFiberRoot(update.instance.__fiber); // traverse `.parent` 属性

  if (update.from === HOST_ROOT) {
    nextUnitOfWork = {
      tag: HOST_ROOT,
      // commit phase 做判断的时候需要
      stateNode: update.dom,
      props: update.newProps,
      alternate: root
    };
  } else {
    // component
    // 将 update.partialState 拷到 intance.__fiber 身上
    // 而不是直接在 setState 的时候直接更新 this.state
    // 是因为我们可以在后面 diff 的时候看 this.state
    // 和 update.partialState 对比，看是否需要重新渲染
    // 来做一个优化，毕竟只有 props 或者 state 改变了才会重新渲染
    update.instance.__fiber.partialState = update.partialState;
    nextUnitOfWork = {
      tag: HOST_ROOT,
      // commit phase 做判断的时候需要
      stateNode: root.stateNode,
      props: root.props,
      alternate: root
    };
  }
}

function commitDeletion(fiber, domParent) {
  let node = fiber;

  while (true) {
    // 因为 fiber 是链表结构的
    // 所以 fiber 如果是组件的话 需要.chlid -> .sibling -> uncle(.parent.sibling) 的删除
    // fiber -> child -> sibling -> sibling
    // ↓  ↓----------parent-------------⏎
    // sibling -> child -> sibling
    if (node.tag == CLASS_COMPONENT) {
      node = node.child;
      continue;
    }

    domParent.removeChild(node.stateNode);

    while (node != fiber && !node.sibling) {
      node = node.parent;
    }

    if (node == fiber) {
      return;
    }

    node = node.sibling;
  }
} // 打了 effectTag 的 fiber 就是一个 effect


const commitWork = fiber => {
  let parentFiber = fiber.parent; // 如果是组件的话，那么得 traverse parent
  // 找到一个 HOST_COMPONENT，也就是 dom 元素

  if (parentFiber.tag === CLASS_COMPONENT) {
    while (parentFiber.tag === CLASS_COMPONENT) {
      parentFiber = parentFiber.parent;
    }
  }

  const parentDom = parentFiber.stateNode;

  if (fiber.effectTag === PLACEMENT) {
    if (fiber.tag === HOST_COMPONENT) {
      parentDom.appendChild(fiber.stateNode);
    }
  } else if (fiber.effectTag === UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === DELETION) {
    commitDeletion(fiber, parentDom);
  }
};

function commitAllWork(fiber) {
  fiber.effects.forEach(effect => commitWork(effect));
  currentRoot = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

function workLoop(deadline) {
  // 如果没有任务，那么从 updateQueue 中取一个出来
  if (!nextUnitOfWork) {
    kickStartWorkLoop();
  } // 是否应该产出任务来继续下一个任务的 diff


  let shouldYield = true;

  while (nextUnitOfWork && shouldYield) {
    nextUnitOfWork = performNextUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() > ENOUGH_TIME;
  } // Render phase 结束：所有 update 的 diff 都已完成
  // 进入 Commit phase


  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
} // 用来清空 updateQueue 的


function performWork(deadline) {
  // Step3: 渐进式 diff
  workLoop(deadline);
  const isCurrentUpdateNotFinished = nextUnitOfWork;
  const haveMoreUpdateInTheQueue = updateQueue.length > 0;

  if (isCurrentUpdateNotFinished || haveMoreUpdateInTheQueue) {
    // 继续调用 workLoop 进行 diff
    requestIdleCallback(performWork);
  }
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance,
    partialState
  });
  requestIdleCallback(performWork);
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {}; // 实例有可能自己定义了
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }

} // 实例化组件


function createComponentInstance(fiber) {
  const {
    type,
    props
  } = fiber;
  const componentInstance = new type(props);
  componentInstance.__fiber = fiber;
  return componentInstance;
}

const HOST_COMPONENT = "host";
const CLASS_COMPONENT = "class";
const HOST_ROOT = "root"; // 更新的话 都是 fiber 和 element 进行对比

function render(element, parentDom) {
  // Step1: queue 一个 update
  updateQueue.push({
    from: HOST_ROOT,
    dom: parentDom,
    newProps: {
      children: [element]
    }
  }); // Step2: diff 一个 update
  // 一个 update 会有很多 fiber 的 diff
  // 一个 fiber 的 diff 是一个 work

  requestIdleCallback(performWork);
} // 用 Didact.render 的时候，直接跑 diff


requestIdleCallback(workLoop);
const Didact = {
  createElement,
  render,
  Component
};

class Cell extends Didact.Component {
  render() {
    var _props = this.props,
        text = _props.text,
        delay = _props.delay;
    wait(delay);
    return Didact.createElement("td", null, text);
  }

}

class Demo extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0,
      // the number shown on each Cell
      size: 6,
      // the size of a row
      period: 1000,
      // the time (in ms) between updates
      delay: 3 // the delay (in ms) for the render of each Cell

    };
    this.changeDelay = this.changeDelay.bind(this);
    this.changePeriod = this.changePeriod.bind(this);
    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick() {
    var _this = this;

    setTimeout(function () {
      _this.setState({
        elapsed: _this.state.elapsed + 1
      });

      _this.tick();
    }, this.state.period);
  }

  changeDelay(e) {
    this.setState({
      delay: +e.target.value
    });
  }

  changePeriod(e) {
    this.setState({
      period: +e.target.value
    });
  }

  render() {
    var _state = this.state,
        elapsed = _state.elapsed,
        size = _state.size,
        delay = _state.delay,
        period = _state.period;
    var text = elapsed % 10;
    var array = Array(size).fill();
    var row = array.map(function (x, key) {
      return Didact.createElement(Cell, {
        key: key,
        text: text,
        delay: delay
      });
    });
    var rows = array.map(function (x, key) {
      return Didact.createElement("tr", {
        key: key
      }, row);
    });
    return Didact.createElement("div", {
      style: {
        display: "flex"
      }
    }, Didact.createElement("table", null, Didact.createElement("tbody", null, rows)), Didact.createElement("div", null, Didact.createElement("p", null, "The table refreshes every ", Didact.createElement("b", null, Math.round(period)), "ms"), Didact.createElement("input", {
      id: "period-range",
      type: "range",
      min: "200",
      max: "1000",
      step: "any",
      value: period,
      onChange: this.changePeriod
    }), Didact.createElement("p", null, "The render of each cell takes ", Didact.createElement("b", null, delay.toFixed(2)), "ms"), Didact.createElement("input", {
      id: "delay-range",
      type: "range",
      min: "0",
      max: "10",
      step: "any",
      value: delay,
      onChange: this.changeDelay
    }), Didact.createElement("p", null, "So, sync rendering the full table will keep the main thread busy for ", Didact.createElement("b", null, (delay * size * size).toFixed(2)), "ms")));
  }

}

function wait(ms) {
  var start = performance.now();

  while (performance.now() - start < ms) {}
}

(function () {
  var frames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;
  var colWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "2px";
  var container = document.createElement("div");
  container.style.position = "fixed";
  container.style.right = "10px";
  container.style.top = "0";
  container.style.zIndex = "99999";

  for (var _i = 0; _i < frames; _i++) {
    var fc = document.createElement("div");
    fc.style.background = "red";
    fc.style.width = colWidth;
    fc.style.display = "inline-block";
    fc.style.verticalAlign = "top";
    fc.style.opacity = "0.8";
    container.appendChild(fc);
    fc.style.height = "16px";
  }

  var last = performance.now();
  var i = 0;

  function refresh() {
    var now = performance.now();
    var diff = now - last;
    last = now;
    container.childNodes[i % frames].style.background = "red";
    i++;
    container.childNodes[i % frames].style.background = "black";
    container.childNodes[i % frames].style.height = diff + "px";
    requestAnimationFrame(refresh);
  }

  requestAnimationFrame(refresh);
  document.body.appendChild(container);
})();

const rootDom = document.getElementById("root");
render(Didact.createElement(Demo, null), rootDom);
const a = [Didact.createElement("a", null, "test"), Didact.createElement("b", null, "324")];