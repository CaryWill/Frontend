function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props,
      children: children.map(child => typeof child === "object" ? child : createTextElement(child))
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

const Didact = {
  createElement
}; // 告诉 babel 使用 Didact 的 createElement 来支持 jsx 语法 

/** @jsx Didact.createElement */

const element = Didact.createElement("div", {
  id: "foo"
}, Didact.createElement("a", null, "bar"), Didact.createElement("b", null));