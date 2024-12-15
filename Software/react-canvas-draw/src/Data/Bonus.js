"use strict";

class Bonus {
    constructor(bonus, filter, source) {
        this.bonus = bonus;//the bonus amount
        this.filter = filter;//what it is a bonus to (ex: Accuracy, Dodge Variance, etc)
        this.source = source;//where the bonus is coming from (ex: species, feature, etc)

        this.editing = false;
    }
}
export default Bonus;

export function inflateBonus(bonus) {
    Object.setPrototypeOf(bonus, Bonus.prototype);
}