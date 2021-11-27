// import { deepCopy } from "./index.js";
import { deepCopy } from "./revisited";

const obj = { x: 1, y: { key: 123 } };
const objShallowCopy = { ...obj };

console.log(objShallowCopy);

obj.y.key = 456;

console.log(objShallowCopy);

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
arr.push(123);
target.object.key.key1.value1 = 'test';

