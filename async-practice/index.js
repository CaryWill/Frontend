async function foo() {
  console.log("foo");
  // 相当于 return Promise.resolve(undefined);
}
async function bar() {
  console.log("bar start");
  await foo(); // 这里和 下面的 promise 应该会 racing
  console.log("bar end");
}
console.log("script start");
setTimeout(function () {
  console.log("setTimeout");
}, 0);
bar();
new Promise(function (resolve) {
  console.log("promise executor");
  resolve();
}).then(function () {
  console.log("promise then");
});
console.log("script end");

// macro queue [setTimeout, ]
// micro queue [promise then]
// chrome和safari 对于 promise then 和 bar end 的结果不一致
// script start
// bar start
// foo
// promise executor
// script end
// bar end 
// promise then
// setTimeout