"use strict";

import { inflateArray, clamp, isNumber, formatNumber } from "../Utility/Utility";
import { rollDice } from "./DiceRoller";

class RollSlot {
    constructor(character, statName, goalFunc, statusFunc) {
        this.character = character;
        this.characterName = this.character.name;
        this.statName = statName;
        this.willPower = 0;
        this.goalFunc = goalFunc;
        this.statusFunc = statusFunc;
        //
        this.stat = this.character.getStat(statName) ?? {};
        this.lastRoll = undefined;
        //
        this.label = this.stat.name ?? this.statName;
        this.rollable = true;
        this.totalFunc = undefined;
    }

    getDisplayText() {
        return `${this.character.name} ${this.label}: ${formatNumber(this.stat.Stat)} + d${formatNumber(this.stat.StatVariance)}`;
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
        let willPowerFactor = this.character.getStatValue("willpowerfactor");
        this.willPower = Math.max(Math.ceil(diff / willPowerFactor), 1);
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
        if (this.totalFunc) {
            return this.totalFunc(this.lastRoll, this.WillPower);
        }
        return this.lastRoll + (this.WillPower ?? 0) * this.character.getStatValue("willpowerfactor");
    }

    get Status() {
        return this.statusFunc?.(this.Total || undefined) ?? "";
    }

    acceptState(rollSlot) {
        this.willPower = rollSlot.willPower;
        this.lastRoll = rollSlot.lastRoll;
    }
}
export default RollSlot;

export function inflateRollSlot(rollSlot, characterList) {
    Object.setPrototypeOf(rollSlot, RollSlot.prototype);

    rollSlot.character = characterList.find(char => char.name = rollSlot.characterName);

    return rollSlot;
}