
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

function render(element, container) {
  const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);

  const isProperty = key => key !== "children";

  Object.keys(element.props).filter(isProperty).forEach(name => {
    dom[name] = element.props[name];
  });
  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
}

var Didact = {
  createElement,
  render
}; // 告诉 babel 使用 Didact 的 createElement 来支持 jsx 语法 

/** @jsx Didact.createElement */

const element = Didact.createElement("div", {
  style: "background: salmon"
}, Didact.createElement("h1", null, "Hello World"), Didact.createElement("h2", {
  style: "text-align:right"
}, "from Didact"));
const container = document.getElementById("root");
Didact.render(element, container);