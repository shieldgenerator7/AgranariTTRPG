"use strict";

import { inflateArray, clamp, isNumber } from "../Utility/Utility";
import { rollDice } from "./DiceRoller";

class RollSlot {
    constructor(character, statName, goalFunc, statusFunc) {
        this.character = character;
        this.characterName = this.character.name;
        this.statName = statName;
        this.willPower = undefined;
        this.goalFunc = goalFunc;
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
        goal ??= this.goalFunc?.();
        let diff = goal - this.lastRoll;
        let willPowerFactor = this.character.getStat("willpowerfactor").Stat;
        this.willPower = Math.ceil(diff / willPowerFactor);
    }

    get WillPower() {
        return this.willPower;
    }
    set WillPower(value) {
        if (isNumber(value * 1)) {
        this.willPower = clamp(value, 0, this.character.resources.willPower);
        }
        else {
            this.willPower = undefined;
        }
    }

    get Total() {
        return this.lastRoll + (this.WillPower ?? 0) * this.character.getStat("willpowerfactor").Stat;
    }

    get Status() {
        return this.statusFunc?.(this.Total) ?? "";
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