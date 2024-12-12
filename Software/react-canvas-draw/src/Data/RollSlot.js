"use strict";

class RollSlot{
    constructor(character, statName, statusFunc) {
        this.character = character;
        this.statName = statName;
        this.willPower = 0;
        this.statusFunc = statusFunc;
        //
        this.stat = this.character.getStat(statName);
        this.lastRoll;
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
}
export default RollSlot;
