"use strict";

import { DIE_ROLL_FLAIR_CRIT, DIE_ROLL_FLAIR_FUMBLE, DIE_ROLL_FLAIR_NORMAL } from "./Constants";
import Roll from "./Roll";
import RollGroup from "./RollGroup";

class DiceRoller {
    constructor() {

    }


    rollDice(dieRollString) {

        if (!dieRollString.includes("d")) {
            console.error("Input must be in die roll form, ex: 1d20.", dieRollString);
            return 0;
        }
        let split = dieRollString.split("d").map(v => (v.trim() || 1) * 1);
        this._rollDice(split[0], split[1]);
    }
    _rollDice(count, die) {
        let sum = 0;
        for (let i = 0; i < count; i++) {
            let roll = Math.ceil(Math.random() * die);
            sum += roll;
        }
        return sum;
    }
}
export default DiceRoller;

export function rollDice(dieRollString) {

    if (!dieRollString.includes("d")) {
        console.error("Input must be in die roll form, ex: 1d20.", dieRollString);
        return 0;
    }
    let split = dieRollString.split("d").map(v => (v.trim() || 1) * 1);
    return _rollDice(split[0], split[1]);
}
function _rollDice(count, die) {
    let group = new RollGroup();
    for (let i = 0; i < count; i++) {
        let value = Math.random() * die;
        let flair = (value == die)
            ? DIE_ROLL_FLAIR_CRIT
            : (value == 1)
                ? DIE_ROLL_FLAIR_FUMBLE
                : DIE_ROLL_FLAIR_NORMAL;
        group.addRoll(`d${die}`, value, flair);
    }
    return group;
}
window.rollDice = rollDice;

global.rollDice = rollDice;