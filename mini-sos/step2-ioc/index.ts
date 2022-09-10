import { Container } from "inversify";
import { injectable, inject } from "inversify";
import "reflect-metadata";

// 单例模式 - 依赖注入实例 {{{
interface Weapon {
  throw: Function;
}

@injectable()
class Shuriken implements Weapon {
  public throw() {
    return "hit!";
  }
}

@injectable()
class Ninja {
  private weapon: Weapon;

  constructor(@inject("Weapon") weapon: Weapon) {
    this.weapon = weapon;
  }

  attack() {
    console.log(this.weapon.throw());
  }
}

const myContainer = new Container({ defaultScope: "Singleton" });
myContainer.bind<Weapon>("Weapon").to(Shuriken);
//myContainer.bind<Ninja>("Warrior").to(Ninja);
//myContainer.get<Ninja>("Warrior").attack();

// 一个 service id 只能绑定一个 service
/*const Ninja2 = Ninja;
myContainer.bind<Ninja>("Warrior").to(Ninja2);
myContainer.get<Ninja>("Warrior").attack();*/
// }}}

// 工作台插件举例 - Constraints {{{
// https://github.com/inversify/InversifyJS/blob/master/wiki/contextual_bindings.md
const Ninja3 = Ninja;
myContainer.bind<Ninja>("Warrior").to(Ninja3).whenTargetNamed("ninja3");
myContainer.bind<Ninja>("Warrior").to(Ninja3).whenTargetNamed("ninja4");
myContainer.getNamed<Ninja>("Warrior", "ninja3").attack();

interface Plugin { name: string; }
@injectable()
class Plugin1 { name = 'plugin1' }
@injectable()
class Plugin2 { name = 'plugin2' }
myContainer.bind<Plugin>("com.xixikf.workbench.Plugin").to(Plugin1).whenTargetNamed("plugin1")
myContainer.bind<Plugin>("com.xixikf.workbench.Plugin").to(Plugin2).whenTargetNamed("plugin2")
const plugin1 = myContainer.getNamed<Plugin>("com.xixikf.workbench.Plugin", "plugin1");
const plugin2 = myContainer.getNamed<Plugin>("com.xixikf.workbench.Plugin", "plugin2");
console.log(plugin1, plugin2);
// 获取所有的 plugin
const allPlugins = myContainer.getAll<Plugin[]>("com.xixikf.workbench.Plugin");
console.log('allPlugins', allPlugins);
// }}}

// 其他 {{{
// 1. 除了可以绑定到一个类上，然后帮你初始化实例，也可以直接绑定到一个常量上
myContainer.bind<number>('seven').toConstantValue(7);
const seven = myContainer.get<number>('seven');
console.log(seven);
// }}}

// vim: set foldmethod=marker foldlevel=0 foldenable:
