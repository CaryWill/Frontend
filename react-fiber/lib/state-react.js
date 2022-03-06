/** @jsx Didact.createElement */
// 上面这一行告诉 babel 使用我们自定义的 `createElement` 来构建 fiber(vnode)
// 系列2
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
}

function instantiate(fiber) {
  const {
    type
  } = fiber;
  const props = fiber.props || {};
  const {
    children
  } = props || {}; // create corresponding node

  let node;

  if (typeof type !== "string") {
    // 组件
    const instance = new type(props);
    node = instantiate(instance.render());
  } else if (type === "TEXT_ELEMENT") {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
    children?.forEach(vnode => node.appendChild(instantiate(vnode)));
  } // set listener


  const isListener = attr => attr.startsWith("on");

  Object.keys(props).filter(isListener).forEach(listener => {
    const type = listener.toLowerCase().slice(2);
    node.addEventListener(type, props[listener]);
  }); // add attributes to node

  const isProperty = attr => attr !== "children" && !isListener(attr);

  Object.keys(props).filter(isProperty).forEach(attr => node[attr] = props[attr]);
  return node;
}

function render(fiber, container) {
  const node = instantiate(fiber);

  if (container.lastChild) {
    // 因为我们一开始使用的是 appendChild 所以我们只需要使用 `lastChild`
    // 就可以获得容器里的所有内容了
    container.replaceChild(node, container.lastChild);
  } else {
    container.appendChild(node);
  }
}

const Didact = {
  createElement
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
        }); // 我们需要调用 root vnode 对应的实例身上的 render 函数
        // 来获取最新的 vnode，然后才可以将其更新到 dom 上
        // 那么具体怎么更新呢？ 我们拿不到整个 vnode tree，只能拿到
        // 当前 vnode 实例返回的 vnode
        // 1. 通过 props 将需要的东西传下来（实例也好，实例返回的 vnode 也好，都是对 dom 进行全量更新
        // 2. 拿到当前 vnode 对应的 dom，然后进行 patch 更新
        // 显然在当前的实现下，是拿不到 vnode 对应的 dom 的，因为 vnode 只有 type 和 props 两个属性
        // 这里暂时通过第一种方式进行 patch
        // 不过，这样的话，虽然组件有了状态，但是，每次更新到 dom 上
        // 我们需要重新创建所有的 dom 节点，这样性能是十分差的
        // FIXME: 如果当前组件状态变了，我们能获取当前组件的所对应的
        // dom 的 parent node 来调用当前组件 `this.render()` 来
        // 只更新当前组件的 dom，这样性能就会提升不少，这也就是下面会介绍的
        // reconcilation 来只更新当前组件的 dom
        // 我们会将 vnode 包一层，这样我们可以拿到每一个 vnode 对应的 dom 节点
        // 进行 patch 更新

        this.props.update();
      }
    }, "click"));
  }

}

class Container extends Didact.Component {
  render() {
    return Didact.createElement("div", null, Didact.createElement("div", null, "Note:"), Didact.createElement(App, {
      update: () => {
        render(this.render(), container);
      }
    }));
  }

}

render(Didact.createElement(Container, null), container);