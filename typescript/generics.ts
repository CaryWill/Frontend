// What is main reason to use generics TypeScript in case?
// https://stackoverflow.com/a/49619913
// 1. Defining a relationship between input and output parameters types.
function test<T>(input: T[]): T {
  return input[0];
}

// 2. You can remove some unnecessary type casts.
interface Item {
  a?: Number;
  b?: any;
  x?: any;
}
const list: Array<Item> = [{ a: 1 }, { b: 2 }];
list.forEach((item) => {
  console.log(item.x);
});
// compare to this one
// list.forEach((item: any) => {
//   console.log(item.x);
// });

//
class Account {
  money: number = 0;
}
class Saving extends Account {
  save = (m: number) => {
    this.money += m;
    return this.money;
  };
}