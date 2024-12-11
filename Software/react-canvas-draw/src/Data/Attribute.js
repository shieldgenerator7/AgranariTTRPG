"use strict";

import { clamp } from "../Utility/Utility";
import { LIMIT_POSITIVE_ONLY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE, REGEX_SPACER_TEST } from "./Constants";

let stringifyAttribute = [
    "name",
    "displayname",
    "xp",
    "xp_variance",
]

class Attribute {
    constructor(name, statCost) {
        
        //save variables
        this.name = name;
        this.displayName = "";
        this.xp = 0;
        this.xp_variance = 0;

        //computed variables
        this.statCost = statCost ?? 20;
        this.bonusList = {};
        this.bonusTotal = 0;
        this.lastRoll = 0;
        this.statValue = 0;
        this.statVarianceValue = 0;
        this.displayStyle = 0;//TODO: make setting for this; 0: 20 +d20, 1: 20 - 40
    }

    get XP() {
        return this.xp;
    }
    set XP(value) {
        this.xp = value;
        this._computeValues();
    }

    get XPVariance() {
        return this.xp_variance;
    }
    set XPVariance(value) {
        this.xp_variance = value;
        this._computeValues();
    }

    get Stat() {
        return this.statValue;
    }

    get StatVariance() {
        return this.statVarianceValue;
    }

    acceptStatCost(statCost) {
        this.statCost = statCost;
        this._computeValues();
    }

    acceptBonus(source, bonus) {
        this.bonusList[source] = bonus;
        this._computeValues();
    }

    removeBonus(source) {
        delete this.bonusList[source];
        this._computeValues();
    }

    _computeValues() {
        //bonus total        
        this.bonusTotal = 0;
        this.bonusList ??= {};
        Object.entries(this.bonusList).forEach(([k, v]) => {
            this.bonusTotal += v; 
        });

        //stat value
        this.statValue = this.xp / this.statCost + this.bonusTotal;

        //stat variance value
        this.statVarianceValue = this.xp_variance / (this.statCost / 5);
    }

    getDisplayText() {
        switch (this.displayStyle) {
            case 0:
                return `${this.displayName || this.name}: ${Math.cut(this.Stat)} + d${Math.cut(this.StatVariance)} = ${Math.cut(this.lastRoll) || "---"}`;
            case 1:
                return `${this.displayName || this.name}: ${Math.cut(this.Stat)} - ${Math.cut(this.StatVariance + this.Stat)} = ${Math.cut(this.lastRoll) || "---"}`;
            default:
                return `${this.displayName || this.name}: no display style for`;
        }
    }
}
export default Attribute;

export function inflateAttribute(attribute) {
    Object.setPrototypeOf(attribute, Attribute.prototype);

    attribute.statCost = attribute.statCost ?? 20;
    attribute.lastRoll = 0;
    attribute.displayStyle = 0;
    attribute._computeValues();
}
