// demo https://codesandbox.io/s/didact-2-k6rbj?file=/src/index.js:887-1112

let nextUnitOfWork = null;
// 在 diff 中的 fiber tree， diff 完写入 dom
// 来保证 UI 的完整性
let wipRoot = null;
let currentRoot = null; // 上个 commited 的 fiber tree
let deletions = null

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

function updateDom(dom, prevProps, nextProps) {
  const isEvent = key => key.startsWith("on")
  const isProperty = key =>
    key !== "children" && !isEvent(key)
  const isNew = (prev, next) => key =>
    prev[key] !== next[key]
  const isGone = (prev, next) => key => !(key in next)

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => {
      dom[name] = ""
    })
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name]
    })

  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key =>
        !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
        eventType,
        prevProps[name]
      )
    })
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

// commit phase
function commitRoot() {
  deletions.forEach(commitWork)
  commitWork(wipRoot.child)
  wipRoot = null
}

function commitWork() {
  // TODO: 我第一次 render 的时候 fiber tree root 应该也没有 parent 属性才对啊？
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom
  // ??? TODO:
  if (
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function render(element, container) {
  // when render fn is called, enter render phase and turn the `element`
  // to a root fiber tree then set it as nextUnitOfWork
  // when main thread is idle, aka, stack is empty, then `workloop` will
  // be called to start perform the reconcilation process(render phase)
  // 首先创建一个 fiber root，因为我们要将 element 转换成一个和 container 匹配的 fiber root
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // old tree
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 如果没有下一个任务了
  // 那我们进入 commit phase 将 fiber tree 写入到 dom 中
  // 来更新下完整的 UI
  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop);
}

// create and reconcile fiber
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let prevSibling = null;
  // fiber tree 是使用 child, sibling link 起来的
  let oldFiber =
    wipFiber.alternate && wipFiber.alternate.child;

  // TODO: oldFiber != null 这个条件什么用
  while (index < elements.length ||
    oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType =
      oldFiber &&
      element &&
      element.type == oldFiber.type

    // create fiber and reconcile
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom, // TODO: 什么时候创建了 dom node
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }

    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null, // 需要重新创建在 commit 的时候
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION"
      deletions.push(oldFiber)
    }

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

// create fiber and form a wipfiber tree
function performUnitOfWork(fiber) {
  // what a fiber data structure looks like
  // let fiber = {
  //   tag: HOST_COMPONENT,
  //   type: "div",
  //   parent: parentFiber,
  //   child: childFiber,
  //   sibling: null,
  //   alternate: currentFiber,
  //   stateNode: document.createElement("div"),
  //   props: { children: [], className: "foo"},
  //   partialState: null,
  //   effectTag: PLACEMENT,
  //   effects: []
  // };

  // when first enter render phase
  // param fiber will be the root of fiber tree
  // and its children props should be `element` vnode
  // which you will convert it to fiber
  // and, here, root of fiber tree has `dom` which is container,
  // and dont have `parent` which should be null
  // 1. 如果在 performUnitOfWork 里面对真实 dom 进行操作的话，
  // 那么如果 main thread 有任务的话，那么那一刻我们的 UI 就是不完整的了
  // 所以这个函数里面不应该有 mutate dom 的动作
  // 当出现新增的 dom 的时候，那么旧的 fiber 身上的 dom 属性肯定就是 null 了
  // 我们在这里使用 createDom 来创建对应的新的 dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 2. create new fibers
  // turn element to fiber
  const elements = fiber.props.children;

  // construct fiber tree using `child`, `sibling`, `uncle` attrs
  reconcileChildren(fiber, elements);

  // 3. return next unit of work
  // child -> sibling -> uncle direction to find
  // the next unit of work
  // 3.1 child
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber
  while (nextFiber) {
    // 3.2 sibling
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    // 3.3 uncle
    nextFiber = nextFiber.parent
  }
}

requestIdleCallback(workLoop);

var Didact = {
  createElement,
  render,
};

// 告诉 babel 使用 Didact 的 createElement 来支持 jsx 语法
/** @jsx Didact.createElement */
const element = (
  <div style="background: salmon">
    <h1>Hello World</h1>
    <h2 style="text-align:right">from Didact</h2>
  </div>
);
const container = document.getElementById("root");
Didact.render(element, container);
