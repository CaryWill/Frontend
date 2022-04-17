var inversify = require("inversify");
require("reflect-metadata");

class Ninja {
  fight() {
    return "fight!"
  }
}

inversify.decorate(inversify.injectable(), Ninja);
const ninja_id = "Ninja"; 
const container = new inversify.Container();
// 用这个 ninja_id key（serviceIdentifier） 来 map 一个实现类
container.bind(ninja_id).to(Ninja);
// 分析依赖，注入依赖，初始化实例
// const ninja = container.get(ninja_id);
