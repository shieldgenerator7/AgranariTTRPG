"use strict";

import { ACTION_ROLL_MODIFY, ONCLICK_TOGGLE } from "./Constants";

class Ability {
    constructor(name) {
        this.name = name;
        this.description = "";

        //resource
        this.resourceName = "";
        this.resourceCost = 0;

        //on click
        this.onclick = ONCLICK_TOGGLE;
        this.action = ACTION_ROLL_MODIFY;

        //effect
        this.dieRollBonus = 0;
        this.dieRollAttributeFilter = "";//"Attack" or other attribute

        //runtime vars
        this.active = false;

    }

    get Active() {
        return this.active;
    }
    set Active(value) {
        this.active = value;
    }

    get ConsumesResource() {
        return this.resourceName && this.resourceCost > 0;
    }
}
export default Ability;

//2024-09-24: copied from Ability/Ability.js
export function inflateAbility(ability) {
    Object.setPrototypeOf(ability, Ability.prototype);
}
