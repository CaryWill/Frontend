// vnode:
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
function createElement(vnode) {
  const {
    type,
    props: {
      children,
      nodeValue = "",
      ...rest
    }
  } = vnode;

  if (type === "TEXT_ELEMENT") {
    node = document.createTextNode(nodeValue);
  } else {
    node = document.createElement(type);
  }

  return node;
}

function render(vnode, container) {
  const {
    props: {
      children
    }
  } = vnode;
  let node = createElement(vnode);
  children?.forEach(child => {
    render(child, node);
  });
  container.appendChild(node);
}

const Didact = {
  createElement
};
/** @jsx Didact.createElement */

const vnode = Didact.createElement("div", null, Didact.createElement("h1", null, "h1"), Didact.createElement("h2", null, "h2"));
const container = document.getElementById("root");
render(element, container);