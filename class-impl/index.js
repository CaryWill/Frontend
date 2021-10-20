// https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011%2C%3E%200.25%25%2C%20not%20dead&build=&builtIns=false&corejs=3.6&spec=false&loose=false&code_lz=MYGwhgzhAECC0FMAeAXBA7AJjAQtA3gL5A&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Creact%2Cstage-2&prettier=false&targets=&version=7.15.8&externalPlugins=&assumptions=%7B%7D

// 父类
function superClass() {
  this.name = "superClass";
  this.hello = () => console.log("hello");
}
superClass.static = "static";

// 子类
function subClass() {
  superClass.call(this);
  this.name = "subClass";
  this.hi = () => console.log("hi");
}
subClass.alsoStatic = "alsoStatic";

// inheritance
subClass.prototype = Object.create(superClass.prototype, {
  constructor: subClass,
});

Object.setPrototypeOf(subClass, superClass);

// test
const instance = new subClass();
instance.hi(); // 'hi'
instance.hello(); // 'hello'
subClass.alsoStatic; // 'alsoStatic'
subClass.static; // 'static'
