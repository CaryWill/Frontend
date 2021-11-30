// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
/**
 * @title apply
 * @desc The apply() method calls a function with a given this value, and arguments provided as an array (or an array-like object).
 * @param context thisArg. Note that this may not be the actual value seen by the method: if the method is a function in non-strict mode code, null and undefined will be replaced with the global object, and primitive values will be boxed. This argument is required.
 */
Function.prototype.apply = function (context) {
  context = context ? Object(context) : window;
  context.fn = this;
  let result;
  let args = [...arguments][1];
  if (!args) {
    result = context.fn();
  } else {
    result = context.fn(...args);
  }
  delete context.fn;
  return result;
};

// const test = function() { console.log(this?.x) };
// test.apply(null, [12]); // undefined
// test.apply(1, [12]); // undefined
// test.apply({x:1}, [12]); // 1
// test.apply({x:1}); // 1

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
Function.prototype.call = function (context, ...args) {
  const _args = args.length === 0 ? undefined : args;
  return this.apply(context, _args);
};

const testCall = function (...args) {
  console.log(this?.x, ...args);
};
testCall.call(null, 12, 13); // undefined 12 13

// bind, call, apply 都绑定 this，但是 bind 只是绑定了 this，返回一个原来函数的 copy
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
Function.prototype.bind = function (context) {
  context = context ? Object(context) : window;
  context.fn = this;
  const result = (...args) => context.fn(...args);
  return result;
};