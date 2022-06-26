import { Container } from "inversify";
import { injectable, inject, tagged } from "inversify";
import "reflect-metadata";

@injectable()
class Ninja {
  constructor(@inject("Weapon") private weapon) {
    this.weapon = weapon;
  }

  attack() {
    console.log(this.weapon.throw());
  }
}

@injectable()
class Shuriken {
  public throw() {
    return "hit!";
  }
}

const myContainer = new Container();
myContainer.bind("Weapon").to(Shuriken);
myContainer.bind("Warrior").to(Ninja);
//myContainer.bind(Symbol.for("Warrior")).to(Ninja);
//myContainer.bind(Symbol.for("Warrior")).to(Ninja);
//const ninja = myContainer.get<Ninja>("Warrior");
//ninja.attack();

// --- bind.toSelf ---
@injectable()
class Apple {}

@injectable()
class Orange {}

myContainer.bind(Apple).toSelf().inSingletonScope();
myContainer.bind(Orange).toSelf().inSingletonScope();
//console.log(myContainer.get(Apple));
//console.log(myContainer.get(Orange));

// --- constraints ---
// https://github.com/inversify/InversifyJS/blob/master/wiki/contextual_bindings.md
myContainer.bind("cary").to(Ninja).whenTargetNamed("goodguy");
myContainer.bind("cary").to(Ninja).whenTargetNamed("goodboy");

//console.log(myContainer.isBoundNamed("cary", "goodguy"));
//console.log(myContainer.isBoundNamed("cary", "goodboy"));
//console.log(myContainer.isBoundNamed("cary", "badboy"));
//console.log(myContainer.getNamed("cary", "goodguy"));

// -- service ---
@injectable()
class Juice {
  name = "juice";
}

myContainer.bind(Juice).toSelf().inSingletonScope();
myContainer.bind("juice").toService(Juice);
myContainer.bind("juice1").toConstantValue(Juice);
console.log(myContainer.get("juice"), myContainer.get("juice1"));

@injectable()
class Rocket {
  name = "rocket"
}
myContainer.bind("rocket").to(Rocket);
console.log((myContainer.get("rocket") as any).name);
