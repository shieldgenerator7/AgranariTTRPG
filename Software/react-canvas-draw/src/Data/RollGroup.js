"use strict";

import { arraySum } from "../Utility/Utility";
import Roll from "./Roll";

class RollGroup {
    constructor(rollList = []) {
        this.name = "";
        this.rollList = rollList;
    }

    get Name() {
        return this.name || this.rollList[0].name;
    }

    get Value() {
        return arraySum(this.rollList, roll => roll.value);
    }

    addRoll(name, value, flair) {
        this.rollList.push(new Roll(name, value, flair));
    }
    
    hasFlair(flair) {
        return this.rollList.some(r => r.flair == flair);   
    }
}
export default RollGroup;

export function inflateRollGroup(rollGroup) {
    Object.setPrototypeOf(rollGroup, RollGroup.prototype);
}
