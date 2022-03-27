// Step 1: Declare your interfaces and types
// Our goal is to write code that adheres to the dependency inversion principle. This means that we should "depend upon Abstractions and do not depend upon concretions". Let's start by declaring some interfaces (abstractions).

import { myContainer } from "./inversify.config";
import { TYPES } from "./types";
import { Warrior } from "./interfaces";

const ninja = myContainer.get<Warrior>(TYPES.Warrior);
console.log(ninja.fight());
console.log(ninja.sneak());
