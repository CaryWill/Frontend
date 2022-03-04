// vnode 结构如下，在 react 里 vnode 被称为 fiber，
// {
//   type: 'div',
//   props: {
//     children: [
//       {
//         type: 'h1',
//         props: {}
//       },
//       {
//         type: 'h2',
//         props: {}
//       }
//     ]
//   }
// }
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props,
      children: children.map(fiber => typeof fiber === "string" ? {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: fiber
        }
      } : fiber)
    }
  };
}

function createDom(fiber) {
  const {
    type,
    props: {
      children = [],
      ...props
    }
  } = fiber; // create corresponding node

  let node;
  console.log(fiber);

  if (type === "TEXT_ELEMENT") {
    node = document.createTextNode("");
  } else {
    node = document.createElement(type);
    children.forEach(vnode => node.appendChild(createDom(vnode)));
  } // add attributes to node


  Object.keys(props).forEach(attr => node[attr] = props[attr]);
  return node;
}

function render(fiber, container) {
  const node = createDom(fiber);
  container.appendChild(node);
}

const Didact = {
  createElement
};
/** @jsx Didact.createElement */
// 转换成 fiber 就是这样的
// const vnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"));

const vnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"));
const container = document.getElementById("root");
render(vnode, container);