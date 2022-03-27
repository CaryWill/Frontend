// Step 1: Declare your interfaces and types

// Our goal is to write code that adheres to the dependency inversion principle. This means that we should "depend upon Abstractions and do not depend upon concretions". Let's start by declaring some interfaces (abstractions).

const TYPES = {
  Warrior: Symbol.for("Warrior"),
  Weapon: Symbol.for("Weapon"),
  ThrowableWeapon: Symbol.for("ThrowableWeapon"),
};

export { TYPES };

