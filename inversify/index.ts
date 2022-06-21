import { Container } from "inversify";
import { injectable, inject } from "inversify";
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
myContainer.bind("Warrior").to(Ninja);
//myContainer.bind(Symbol.for("Warrior")).to(Ninja);
//myContainer.bind(Symbol.for("Warrior")).to(Ninja);
//const ninja = myContainer.get<Ninja>("Warrior");
//ninja.attack();
