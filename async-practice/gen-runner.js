// gennerator runner
function* gen() {
  const v = yield Promise.resolve(1);
  const v2 = yield Promise.reject(v + 2);
  const v3 = yield Promise.resolve(v2 + 2);
  // console.log(v3);
}
// const it = gen();
// it.next().value.then((value) => {
//   it.next(value).value.then((value) => {
//     it.next(value).value.then((value) => {
//       console.log("v3", value);
//     });
//   });
// });
// 正常来说我们想利用 generator，就是想管理异步流程
// 所以 yield 后面的 expression 是异步的逻辑，比如 fetch data 返回一个 promise
// 而这个 yield 返回的数据我们一般可能会在下个 yield 的 expression 里用到

function runner(gen, ...args) {
  const it = gen(...args);
  const handleNext = (v) => {
    const { value, done } = it.next(v);
    if (done) {
      return value;
    } else {
      return Promise.resolve(value).then(handleNext, (err) => {
        return Promise.resolve(it.throw(err)).then(handleNext);
      });
    }
  };
  return handleNext();
}

runner(gen);

// function run(gen) {
//   var args = [].slice.call(arguments, 1),
//     it;

//   // initialize the generator in the current context
//   it = gen.apply(this, args);

//   // return a promise for the generator completing
//   return Promise.resolve().then(function handleNext(value) {
//     // run to the next yielded value
//     var next = it.next(value);

//     return (function handleResult(next) {
//       // generator has completed running?
//       if (next.done) {
//         return next.value;
//       }
//       // otherwise keep going
//       else {
//         return Promise.resolve(next.value).then(
//           // resume the async loop on
//           // success, sending the resolved
//           // value back into the generator
//           handleNext,
//           // if `value` is a rejected”
//           // promise, propagate error back
//           // into the generator for its own
//           // error handling
//           function handleErr(err) {
//             return Promise.resolve(it.throw(err)).then(handleResult);
//           }
//         );
//       }
//     })(next);
//   });
// }

// run(gen);
