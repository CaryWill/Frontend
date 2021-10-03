// TODO: Date, RegexExp, function clone
// 这里没有对函数做深拷贝，因为函数更多的是完成提供处理数据的能力，所以不需要做深拷贝（根据需要来。
// 递归式
const deepCopy = (value) => {
  const map = new WeakMap();
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

// 改版本只实现了数组和对象的深拷贝
const IterableDeepcopy = (obj) => {
  // 如果是 primitive（不是 null 或者 object） 那么直接返回
  if (!obj || typeof obj !== "object") return obj;

  const tasks = []; // 所有的需要深拷贝的需要放到这边来 loop 给 v 的 拷贝赋值
  const copy = Array.isArray(obj) ? [] : {}; // 根据 value 的 type 初始化一个值，在 loop tasks 的时候往里面填充内容
  const map = new WeakMap(); // 和之前一样还是用来解决循环依赖的问题 // 但是这里面的值作为并不表示填充完成的值 在 loop完成前只是拿到对应的引用用来填充 在 loop 结束后才是深拷贝完成的值

  tasks.push(obj); // 初始化待被拷贝的值
  map.set(obj, copy);

  while (tasks.length > 0) {
    const source = tasks.shift();
    const target = map.get(source);
    for (const key in source) {
      const v = source[key];
      if (v && typeof v === "object") {
        if (map.has(v)) {
          // check 是否有循环引用/相同引用
          target[key] = map.get(v);
          // 该属性拷贝结束 下一个
          continue;
        }
        const vCopy = Array.isArray(v) ? [] : {};
        tasks.push(v);
        map.set(v, vCopy);
        target[key] = vCopy; // 设置引用，在下个迭代会拿出这个引用继续往上面添加内容，最终目的还是填充 copy 的值
      } else {
        target[key] = v;
      }
    }
  }

  return copy;
};