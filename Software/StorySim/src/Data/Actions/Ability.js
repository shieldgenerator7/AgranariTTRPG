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

        this.requirementList = [];//TODO: requirements for this ability to be available (ex: holding sword)
        //requirement vs condition:
        //   requirement: something that needs to be true for the ability to be available to be activated / triggered
        //   condition: something that needs to be true for continued processing of the ability (ex: a roll meeting a certain value and/or beating another roll)

        this.processList = [];//list of conditions, rolls, actions (usually in that order)

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
