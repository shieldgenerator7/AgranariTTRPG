"use strict";

import Ability, { inflateAbility } from "./Ability";

class Consumable {
    constructor(name) {
        this.name = name;
        this.ability = new Ability(name);
        this.ability.resourceCost = 1;

        this.Name = name;
    }

    set Name(name) {
        this.name = name;
        this.ability.name = name;
        this.ability.resourceName = name;
    }//
}
export default Consumable;

export function inflateConsumable(consumable) {
    Object.setPrototypeOf(consumable, Consumable.prototype);
    inflateAbility(consumable.ability);
}
