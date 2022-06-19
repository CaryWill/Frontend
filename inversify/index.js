var inversify = require("inversify");
require("reflect-metadata");

class Ninja {
  fight() {
    return "fight!"
  }
}

inversify.decorate(inversify.injectable(), Ninja);
const container = new inversify.Container();
// container.bind("Ninja").to(Ninja);
container.bind("Ninja").toDynamicValue(() => { return Promise.resolve({fight: () => 'My fight!'}); });
// console.log(container._bindingDictionary._map.entries());
const fight = async () => {
  const ninja = await container.getAsync("Ninja")
  console.log(ninja.fight());
}

//fight()

class ClassOnly {
  constructor() {
    console.log('ClassOnly');
  }
}
container.bind("ClassOnly").toConstantValue(ClassOnly);
console.log(container.get("ClassOnly"));
