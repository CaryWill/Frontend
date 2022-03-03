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
function render(vnode, container) {
  const {type, props: {children, nodeValue = '', ...rest}} = vnode;
  let node; // dom node
  if (type === 'TEXT_ELEMENT') {
    node = document.createTextNode(nodeValue);
  } else {
    node = document.createElement(type);
    children?.forEach((child) => {
      render(child, node);
    })
  }
  container.appendChild(node);
};
const Didact = {
  createElement
}
/** @jsx Didact.createElement */
const vnode = <div><h1>h1</h1><h2>h2</h2></div>
const container = document.getElementById('root');
render(element, container);
