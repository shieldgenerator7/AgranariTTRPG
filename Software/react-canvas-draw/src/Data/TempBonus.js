"use strict";

class TempBonus {
    constructor(bonus, filter, source) {
        this.bonus = bonus;//the bonus amount
        this.filter = filter;//what it is a bonus to (ex: Accuracy, Dodge Variance, etc)
        this.source = source;//where the bonus is coming from (ex: species, feature, etc)

        this.editing = false;
    }
}
export default TempBonus;

export function inflateTempBonus(tempBonus) {
    Object.setPrototypeOf(tempBonus, TempBonus.prototype);
}