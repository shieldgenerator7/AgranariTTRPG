"use strict";

import { ACTION_ROLL_MODIFY, ONCLICK_TOGGLE } from "../Constants";

/**
 * Something a character can do, ex: attack or cast a spell
 */
class Ability {
    constructor(name) {
        this.name = name;
        this.description = "";

        //resource
        this.resourceName = "";
        this.resourceCost = 0;

        this.conditionList = [];//TODO: conditions (ex: holding sword)

        this.rollList = [];//rolls to do as part of activating ability

        this.actionList = [];//actions to take based on the result of the rolls (or to just take if there are no rolls to make)

        //ideally i think i would have a custom scripting language for the abilities

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
