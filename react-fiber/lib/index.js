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
// function render(vnode, container) {
//   const {type, props: {children, nodeValue = '', ...rest}} = vnode;
//   let node; // dom node
//   if (type === 'TEXT_ELEMENT') {
//     node = document.createTextNode(nodeValue);
//   } else {
//     node = document.createElement(type);
//     children?.forEach((child) => {
//       render(child, node);
//     })
//   }
//   container.appendChild(node);
// };
const vnode = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "h1"), /*#__PURE__*/React.createElement("h2", null, "h2"));
const container = document.getElementById('root');
render(element, container);