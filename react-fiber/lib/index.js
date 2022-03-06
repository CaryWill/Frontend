// 上面这一行告诉 Babel 使用我们定义的 `createElement` 来创建 vnode(element)
// 为了和 React 对齐，这里用
// `element` 表示 vnode
// `dom` 表示原生 dom node
// NOTE: 你可以用 babel compile `const element = <div><span>1</span><span>2</span></div>`
// 看下 vnode 长什么样
function createElement(type, _props, ...children) {
  // props 如果为空的话 babel 会给你一个 null
  // 这里做下处理让 props 永远为 object
  const props = { ..._props
  }; // 入参里的 props 参数之后的所有参数都是 child element
  // 这里统一将那么 child element 整合到 `props.children`
  // 并且如果 child element 是 text node 的话，就是一个字符串
  // 我们需要将其转换成 element（vnode）的格式

  return {
    type,
    props
  };
}

const Didact = {
  createElement
};
const ele = /*#__PURE__*/React.createElement("div", null, "123", /*#__PURE__*/React.createElement("div", null, "345"));