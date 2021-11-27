function MyWeakMap() {
  this.uniqueKey = Symbol("foo");

  this.set = (k, v) => {
    k[this.uniqueKey] = v;
  };

  this.get = (k) => {
    return k[this.uniqueKey];
  };
}

const obj1 = { x: 1 };
const obj2 = { y: 1 };
const weakMap = new MyWeakMap();
weakMap.set(obj1, { name: "x" });
weakMap.set(obj2, { name: "y" });
console.log(weakMap.get(obj1));
console.log(weakMap.get(obj2));
