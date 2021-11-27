// let source = {
//   string: "John",
//   number: 20,
//   boolean: false,
//   null: null,
//   undefined: undefined,
//   function: () => {},
//   date: new Date(),
//   object: { key: { key1: { value1: "cary" } } },
// };
// // 重新练手 看下最快能多久写完 13 分钟左右 基本逻辑
// const deepClone = (source, map = new WeakMap()) => {
//   const target = {};
//   Object.keys(source).forEach((key) => {
//     if (source[key] !== null && typeof source[key] === "object") {
//       target[key] = map.has(source[key])
//         ? map.get(source[key])
//         : deepClone(source[key], map);
//     } else {
//       target[key] = source[key];
//     }
//   });

//   return target;
// };

// 反思修正版本
// 1. 默认 source 是 obj 了
// 2. 对象建立 hash map 的时机不对,要在入口处建立，也就是source本身如果是对象的话,需要缓存，不然会出现循环引用
const deepCloneFixed = (source, map = new WeakMap()) => {
  if (map.has(source)) return map.get(source);
  debugger;
  if (source !== null && typeof source === "object") {
    const target = {};
    map.set(source, target);
    Object.keys(source).forEach((key) => {
      if (source[key] !== null && typeof source[key] === "object") {
        target[key] = deepCloneFixed(source[key], map);
      } else {
        target[key] = source[key];
      }
    });
    return target;
  } else {
    return source;
  }
};

let target4 = {
  age: 20,
  drive: () => {},
  girlFriend: undefined,
};

target4.target = target4;

const newT = deepCloneFixed(target4);
console.log(newT, target4);
