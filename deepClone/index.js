const obj = { x: 1, y: { key: 123 } };
const objShallowCopy = { ...obj };

console.log(objShallowCopy);

obj.y.key = 456;

console.log(objShallowCopy);

// TODO: Date, RegexExp, function clone
// 这里没有对函数做深拷贝，因为函数更多的是完成提供处理数据的能力，所以不需要做深拷贝（根据需要来。
// 递归式
const map = new WeakMap();
const deepCopy = (value) => {
  let result;
  // 循环引用或者相同引用的时候直接使用之前缓存的值
  if (map.has(value)) return map.get(value);

  if (Array.isArray(value)) {
    result = [];
    map.set(value, result);
    value.forEach((v) => {
      result.push(deepCopy(v));
    });
    return result;
  } else if (typeof value === "object") {
    result = {};
    // 将我们克隆的值存起来，用原来的引用值做 key
    map.set(value, result);
    for (const key in value) {
      if (value[key] !== null && typeof value[key] === "object") {
        result[key] = deepCopy(value[key]);
      } else {
        result[key] = result;
      }
    }
    return result;
  } else {
    return value;
  }
};

let target = {
  string: "John",
  number: 20,
  boolean: false,
  null: null,
  undefined: undefined,
  function: () => {},
  date: new Date(),
  object: { key: { key1: { value1: "cary" } } },
};

const arr = [];
const arr1 = [];
arr[0] = arr1;
arr1[0] = arr;
target.arr = arr;

target.target1 = {};
target.target2 = { target: target.target1 };
target.target1.target = target.target2;

let newObj = deepCopy(target);
console.log(newObj);