"use strict";

import { inflateArray, clamp } from "../Utility/Utility";
import { rollDice } from "./DiceRoller";

class RollSlot {
    constructor(character, statName, statusFunc) {
        this.character = character;
        this.characterName = this.character.name;
        this.statName = statName;
        this.willPower = 0;
        this.statusFunc = statusFunc;
        //
        this.stat = this.character.getStat(statName) ?? {};
        this.lastRoll = undefined;
    }

    getDisplayText() {        
        return `${this.character.name} ${this.stat.name ?? this.statName}: ${Math.cut(this.stat.Stat)} + d${Math.cut(this.stat.StatVariance)}`;
    }

    getRollDisplayText() {
        return `${this.stat.Stat} + d${this.stat.StatVariance}`;
    }

    roll() {
        let roll = rollDice(`1d${this.stat.StatVariance}`);
        roll.addRoll(this.statName, this.stat.Stat);
        this.lastRoll = roll.Value;
    }

    contestWithWillPower(goal) {
        let diff = goal - this.lastRoll;
        let willPowerFactor = this.character.getStat("willpowerfactor");
        this.willPower = Math.ceil(diff / willPowerFactor);
    }

    get WillPower() {
        return this.willPower;
    }
    set WillPower(value) {
        this.willPower = clamp(value, 0, this.character.resources.willPower);
    }

    get Status() {
        return this.statusFunc?.(this.lastRoll) ?? "";
    }

    acceptState(rollSlot) {
        this.willPower = rollSlot.willPower;
        this.lastRoll = rollSlot.lastRoll;
    }
}
export default RollSlot;

export function inflateRollSlot(rollSlot, characterList){
    Object.setPrototypeOf(rollSlot, RollSlot.prototype);

    rollSlot.character = characterList.find(char => char.name = rollSlot.characterName);

    return rollSlot;
}