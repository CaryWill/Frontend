// @jsx Didact.createElement
// NOTE: 上面这一行告诉 Babel 使用我们定义的 `createElement` 来创建 vnode(element)
// 参考文章：
// 1. https://engineering.hexacta.com/didact-rendering-dom-elements-91c9aa08323b
// 2. https://engineering.hexacta.com/didact-element-creation-and-jsx-d05171c55c56
// NOTE: 为了和 React 对齐，这里用
// `element` 表示 vnode
// `dom` 表示原生 dom node
// 构建 vnode
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

  const children = _children.map(function normalize(child) {
    // element
    if (typeof child.type === "object") {
      return child;
    } else {
      // string(not an element), needs convert to element
      return {
        type: "TEXT_ELEMENT",
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

const Didact = {
  createElement
};