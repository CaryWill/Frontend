// function useState(initialValue) {
//   var _val = initialValue; // _val is a local variable created by useState
//   function state() {
//     // state is an inner function, a closure
//     return _val; // state() uses _val, declared by parent funciton
//   }
//   function setState(newVal) {
//     // same
//     _val = newVal; // setting _val without exposing _val
//   }
//   return [state, setState]; // exposing functions for external use
// }

// /// 2
// var [foo, setFoo] = useState(0); // using array destructuring
// console.log(foo()); // logs 0 - the initialValue we gave
// setFoo(1); // sets _val inside useState's scope
// console.log(foo()); // logs 1 - new initialValue, despite exact same call

// function Counter() {
//   const [count, setCount] = useState(0); // same useState as above
//   return {
//     click: () => setCount(count() + 1),
//     render: () => console.log("render:", { count: count() }),
//   };
// }
// const C = Counter();
// C.render(); // render: { count: 0 }
// C.click();
// C.render(); // render: { count: 1 }

/// 3
function useState(initialValue) {
  var _val = initialValue;
  // no state() function
  function setState(newVal) {
    _val = newVal;
  }
  return [_val, setState]; // directly exposing _val
}
var [foo, setFoo] = useState(0);
console.log(foo); // logs 0 without needing function call
setFoo(1); // sets _val inside useState's scope
console.log(foo); // logs 0 - oops!!

const MyReact = (function () {
  const hooks = [];
  let current = 0;

  return {
    render(Component) {
      const Comp = Component();
      Comp.render();
      current = 0;
      return Comp;
    },
    useState(initialValue) {
      let index = current;
      hooks[current] = hooks[current] || initialValue; // assign anew every run
      function setState(newVal) {
        hooks[index] = newVal;
      }
      console.log(current);
      current++;
      return [hooks[index], setState];
    },
    useEffect(callback, deps = []) {
      let hasDepsChanged = false;
      for (let i = 0; i < deps.length; i++) {
        if (deps[i] !== hooks[current]?.[i]) {
          hasDepsChanged = true;
          break;
        }
      }
      if (hasDepsChanged) {
        callback();
      }
      hooks[current] = [...deps];
      current++;
    },
  };
})();

// function Counter() {
//   const [count, setCount] = MyReact.useState(0);
//   return {
//     click: () => setCount(count + 1),
//     render: () => console.log("render:", { count }),
//   };
// }
// let App;
// App = MyReact.render(Counter); // render: { count: 0 }
// App.click();
// App = MyReact.render(Counter); // render: { count: 1 }

// FIXME: 显然上面这样封装还是不行的，因为这个 _val 使用的都是同一个
// function Counter2() {
//   const [count, setCount] = MyReact.useState(0);
//   return {
//     click: () => setCount(count + 1),
//     render: () => console.log("render:", { count }),
//   };
// }
// let App2;
// App2 = MyReact.render(Counter2); // render: { count: 1 }
// App2.click();
// App2 = MyReact.render(Counter2); // render: { count: 2 }

// function Counter() {
//   const [count, setCount] = MyReact.useState(0);
//   MyReact.useEffect(() => {
//     console.log("effect", count);
//   }, [count]);
//   return {
//     click: () => setCount(count + 1),
//     noop: () => setCount(count),
//     render: () => console.log("render", { count }),
//   };
// }
// let App;
// App = MyReact.render(Counter);
// // effect 0
// // render {count: 0}
// App.click();
// App = MyReact.render(Counter);
// // effect 1
// // render {count: 1}
// App.noop();
// App = MyReact.render(Counter);
// // // no effect run
// // render {count: 1}
// App.click();
// App = MyReact.render(Counter);
// effect 2
// render {count: 2}
function Counter() {
  const [count, setCount] = MyReact.useState(0);
  const [text, setText] = MyReact.useState("foo"); // 2nd state hook!
  MyReact.useEffect(() => {
    console.log("effect", count, text);
  }, [count, text]);
  return {
    click: () => setCount(count + 1),
    type: (txt) => setText(txt),
    noop: () => setCount(count),
    render: () => console.log("render", { count, text }),
  };
}

function Counter2() {
	const [count, setCount] = MyReact.useState(0);
	const [text, setText] = MyReact.useState("foo"); // 2nd state hook!
	MyReact.useEffect(() => {
	  console.log("effect", count, text);
	}, [count, text]);
	return {
	  click: () => setCount(count + 1),
	  type: (txt) => setText(txt),
	  noop: () => setCount(count),
	  render: () => console.log("render", { count, text }),
	};
      }
let App;
App = MyReact.render(Counter);
// effect 0 foo
// render {count: 0, text: 'foo'}
App.click();
App = MyReact.render(Counter);
// effect 1 foo
// render {count: 1, text: 'foo'}
App.type("bar");
App = MyReact.render(Counter);
// effect 1 bar
// render {count: 1, text: 'bar'}
App.noop();
App = MyReact.render(Counter);
// // no effect run
// render {count: 1, text: 'bar'}
App.click();
App = MyReact.render(Counter);
// effect 2 bar
// render {count: 2, text: 'bar'}

let App2;
App2 = MyReact.render(Counter2);
// effect 0 foo
// render {count: 0, text: 'foo'}
App2.click();
App2 = MyReact.render(Counter2);
// effect 1 foo
// render {count: 1, text: 'foo'}
App2.type("bar");
App2 = MyReact.render(Counter2);
// effect 1 bar
// render {count: 1, text: 'bar'}
App2.noop();
App2 = MyReact.render(Counter2);
// // no effect run
// render {count: 1, text: 'bar'}
App2.click();
App2 = MyReact.render(Counter2);

