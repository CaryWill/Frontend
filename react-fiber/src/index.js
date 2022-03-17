/** @jsx Didact.createElement */
const TEXT_ELEMENT = "TEXT ELEMENT";

function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));
  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}

const isEvent = name => name.startsWith("on");
const isAttribute = name =>
  !isEvent(name) && name != "children" && name != "style";
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDomProperties(dom, prevProps, nextProps) {
  // Remove event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove attributes
  Object.keys(prevProps)
    .filter(isAttribute)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = null;
    });

  // Set attributes
  Object.keys(nextProps)
    .filter(isAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });

  // Set style
  prevProps.style = prevProps.style || {};
  nextProps.style = nextProps.style || {};
  Object.keys(nextProps.style)
    .filter(isNew(prevProps.style, nextProps.style))
    .forEach(key => {
      dom.style[key] = nextProps.style[key];
    });
  Object.keys(prevProps.style)
    .filter(isGone(prevProps.style, nextProps.style))
    .forEach(key => {
      dom.style[key] = "";
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function createDomElement(fiber) {
  const isTextElement = fiber.type === TEXT_ELEMENT;
  const dom = isTextElement
    ? document.createTextNode("")
    : document.createElement(fiber.type);
  updateDomProperties(dom, [], fiber.props);
  return dom;
}

// Fiber tags
const HOST_COMPONENT = "host";
const CLASS_COMPONENT = "class";
const HOST_ROOT = "root";

// Effect tags
const PLACEMENT = 1;
const DELETION = 2;
const UPDATE = 3;

const ENOUGH_TIME = 1;

// Global state
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

function render(elements, containerDom) {
  updateQueue.push({
    from: HOST_ROOT,
    dom: containerDom,
    newProps: { children: elements }
  });
  requestIdleCallback(performWork);
}

function scheduleUpdate(instance, partialState) {
  updateQueue.push({
    from: CLASS_COMPONENT,
    instance: instance,
    partialState: partialState
  });
  requestIdleCallback(performWork);
}

function performWork(deadline) {
  workLoop(deadline);
  if (nextUnitOfWork || updateQueue.length > 0) {
    requestIdleCallback(performWork);
  }
}

function workLoop(deadline) {
  if (!nextUnitOfWork) {
    resetNextUnitOfWork();
  }
  while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}

function resetNextUnitOfWork() {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }

  // Copy the setState parameter from the update payload to the corresponding fiber
  if (update.partialState) {
    update.instance.__fiber.partialState = update.partialState;
  }

  const root =
    update.from == HOST_ROOT
      ? update.dom._rootContainerFiber
      : getRoot(update.instance.__fiber);

  nextUnitOfWork = {
    tag: HOST_ROOT,
    stateNode: update.dom || root.stateNode,
    props: update.newProps || root.props,
    alternate: root
  };
}

function getRoot(fiber) {
  let node = fiber;
  while (node.parent) {
    node = node.parent;
  }
  return node;
}

function performUnitOfWork(wipFiber) {
  beginWork(wipFiber);
  if (wipFiber.child) {
    return wipFiber.child;
  }

  // No child, we call completeWork until we find a sibling
  let uow = wipFiber;
  while (uow) {
    completeWork(uow);
    if (uow.sibling) {
      // Sibling needs to beginWork
      return uow.sibling;
    }
    uow = uow.parent;
  }
}

function beginWork(wipFiber) {
  if (wipFiber.tag == CLASS_COMPONENT) {
    updateClassComponent(wipFiber);
  } else {
    updateHostComponent(wipFiber);
  }
}

function updateHostComponent(wipFiber) {
  if (!wipFiber.stateNode) {
    wipFiber.stateNode = createDomElement(wipFiber);
  }

  const newChildElements = wipFiber.props.children;
  reconcileChildrenArray(wipFiber, newChildElements);
}

function updateClassComponent(wipFiber) {
  let instance = wipFiber.stateNode;
  if (instance == null) {
    // Call class constructor
    instance = wipFiber.stateNode = createInstance(wipFiber);
  } else if (wipFiber.props == instance.props && !wipFiber.partialState) {
    // No need to render, clone children from last time
    cloneChildFibers(wipFiber);
    return;
  }

  instance.props = wipFiber.props;
  instance.state = Object.assign({}, instance.state, wipFiber.partialState);
  wipFiber.partialState = null;

  const newChildElements = wipFiber.stateNode.render();
  reconcileChildrenArray(wipFiber, newChildElements);
}

function arrify(val) {
  return val == null ? [] : Array.isArray(val) ? val : [val];
}

function reconcileChildrenArray(wipFiber, newChildElements) {
  const elements = arrify(newChildElements);

  let index = 0;
  let oldFiber = wipFiber.alternate ? wipFiber.alternate.child : null;
  let newFiber = null;
  while (index < elements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const element = index < elements.length && elements[index];
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        tag: oldFiber.tag,
        stateNode: oldFiber.stateNode,
        props: element.props,
        parent: wipFiber,
        alternate: oldFiber,
        partialState: oldFiber.partialState,
        effectTag: UPDATE
      };
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        tag:
          typeof element.type === "string" ? HOST_COMPONENT : CLASS_COMPONENT,
        props: element.props,
        parent: wipFiber,
        effectTag: PLACEMENT
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = DELETION;
      wipFiber.effects = wipFiber.effects || [];
      wipFiber.effects.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index == 0) {
      wipFiber.child = newFiber;
    } else if (prevFiber && element) {
      prevFiber.sibling = newFiber;
    }

    index++;
  }
}

function cloneChildFibers(parentFiber) {
  const oldFiber = parentFiber.alternate;
  if (!oldFiber.child) {
    return;
  }

  let oldChild = oldFiber.child;
  let prevChild = null;
  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      tag: oldChild.tag,
      stateNode: oldChild.stateNode,
      props: oldChild.props,
      partialState: oldChild.partialState,
      alternate: oldChild,
      parent: parentFiber
    };
    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      parentFiber.child = newChild;
    }
    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

function completeWork(fiber) {
  if (fiber.tag == CLASS_COMPONENT) {
    fiber.stateNode.__fiber = fiber;
  }

  if (fiber.parent) {
    const childEffects = fiber.effects || [];
    const thisEffect = fiber.effectTag != null ? [fiber] : [];
    const parentEffects = fiber.parent.effects || [];
    fiber.parent.effects = parentEffects.concat(childEffects, thisEffect);
  } else {
    pendingCommit = fiber;
  }
}

function commitAllWork(fiber) {
  fiber.effects.forEach(f => {
    commitWork(f);
  });
  fiber.stateNode._rootContainerFiber = fiber;
  nextUnitOfWork = null;
  pendingCommit = null;
}

function commitWork(fiber) {
  if (fiber.tag == HOST_ROOT) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (domParentFiber.tag == CLASS_COMPONENT) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.stateNode;

  if (fiber.effectTag == PLACEMENT && fiber.tag == HOST_COMPONENT) {
    domParent.appendChild(fiber.stateNode);
  } else if (fiber.effectTag == UPDATE) {
    updateDomProperties(fiber.stateNode, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag == DELETION) {
    commitDeletion(fiber, domParent);
  }
}

function commitDeletion(fiber, domParent) {
  let node = fiber;
  while (true) {
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
}

class Component {
  constructor(props) {
    this.props = props || {};
    this.state = this.state || {};
  }

  setState(partialState) {
    scheduleUpdate(this, partialState);
  }
}

function createInstance(fiber) {
  const instance = new fiber.type(fiber.props);
  instance.__fiber = fiber;
  return instance;
}

var Didact = {
  createElement,
  Component,
  render
};


class Cell extends Didact.Component {
  render() {
    var _props = this.props,
        text = _props.text,
        delay = _props.delay;

    wait(delay);
    return Didact.createElement(
      "td",
      null,
      text
    );
  }
}

class Demo extends Didact.Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsed: 0, // the number shown on each Cell
      size: 6, // the size of a row
      period: 1000, // the time (in ms) between updates
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
      _this.setState({ elapsed: _this.state.elapsed + 1 });
      _this.tick();
    }, this.state.period);
  }
  changeDelay(e) {
    this.setState({ delay: +e.target.value });
  }
  changePeriod(e) {
    this.setState({ period: +e.target.value });
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
      return Didact.createElement(Cell, { key: key, text: text, delay: delay });
    });
    var rows = array.map(function (x, key) {
      return Didact.createElement(
        "tr",
        { key: key },
        row
      );
    });
    return Didact.createElement(
      "div",
      { style: { display: "flex" } },
      Didact.createElement(
        "table",
        null,
        Didact.createElement(
          "tbody",
          null,
          rows
        )
      ),
      Didact.createElement(
        "div",
        null,
        Didact.createElement(
          "p",
          null,
          "The table refreshes every ",
          Didact.createElement(
            "b",
            null,
            Math.round(period)
          ),
          "ms"
        ),
        Didact.createElement("input", {
          id: "period-range",
          type: "range",
          min: "200",
          max: "1000",
          step: "any",
          value: period,
          onChange: this.changePeriod
        }),
        Didact.createElement(
          "p",
          null,
          "The render of each cell takes ",
          Didact.createElement(
            "b",
            null,
            delay.toFixed(2)
          ),
          "ms"
        ),
        Didact.createElement("input", {
          id: "delay-range",
          type: "range",
          min: "0",
          max: "10",
          step: "any",
          value: delay,
          onChange: this.changeDelay
        }),
        Didact.createElement(
          "p",
          null,
          "So, sync rendering the full table will keep the main thread busy for ",
          Didact.createElement(
            "b",
            null,
            (delay * size * size).toFixed(2)
          ),
          "ms"
        )
      )
    );
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
render(<Demo />, rootDom);