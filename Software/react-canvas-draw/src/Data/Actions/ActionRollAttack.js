"use strict";

import RollSlot, { inflateRollSlot } from "../RollSlot";
import { arraySum, isNumber } from "../../Utility/Utility";

const CONDITION_STUNNED = 0;
const CONDITION_UNCONSCIOUS = 1;

class ActionRollAttack {
    constructor(attacker, defender) {
        this.attacker = attacker;
        this.attackerName = attacker.name;
        this.defender = defender;
        this.defenderName = defender.name;

        this.title = `Attack: ${this.attackerName} \u2192 ${this.defenderName}`;

        this.init();
    }

    init() {
        let attacker = this.attacker;
        let defender = this.defender;

        this.attackSlot = new RollSlot(attacker, "accuracy", () => this.dodgeSlot.Total, (total) => this.getHitMessage(total, this.dodgeSlot.Total));
        this.dodgeSlot = new RollSlot(defender, "dodge", () => this.attackSlot.Total, (total) => this.getDodgeMessage(this.attackSlot.Total, total));
        this.damageSlot = new RollSlot(attacker, "damage", () => this.durabilitySlot.Total, (total) => (total > 0) ? "dmg dealt" : "");
        this.damageTakenSlot = new RollSlot(defender, "armor", undefined, (total) => (total > 0) ? "dmg taken" : "");
        this.durabilitySlot = new RollSlot(defender, "durability", () => this.damageTakenSlot.Total, (roll) => (this.damageTakenSlot.Total > roll) ? "WOUNDED" : "");
        this.painToleranceSlot = new RollSlot(defender, "paintolerance", () => this.damageTakenSlot.Total, (roll) => (this.damageTakenSlot.Total > roll) ? "WINCED" : "");
        this.constitutionSlot = new RollSlot(defender, "constitution", () => this.damageTakenSlot.Total, (roll) => (this.defender.MissingHealth + this.damageTakenSlot.Total > roll) ? "UNCONSCIOUS" : "");

        this.damageTakenSlot.label = "Damage Taken";
        this.damageTakenSlot.rollable = false;
        this.damageTakenSlot.totalFunc = (lastRoll, willPower) => this.damageSlot.Total * (100 / (100 + defender.getStatValue("armor")));

        this.rollList = [
            this.attackSlot,
            this.dodgeSlot,
            this.damageSlot,
            this.damageTakenSlot,
            this.durabilitySlot,
            this.painToleranceSlot,
            this.constitutionSlot,
        ];
    }

    getHitMessage(attack, dodge) {
        //early exit: no attack or no dodge
        if (!isNumber(attack) || !isNumber(dodge)) {
            return "";
        }

        //processing
        return (attack > dodge * 2)
            ? "CRIT!"
            : (attack > dodge)
                ? "HIT"
                : "miss";
    }
    getDodgeMessage(attack, dodge) {
        //early exit: no attack or no dodge
        if (!isNumber(attack) || !isNumber(dodge)) {
            return "";
        }

        //processing
        return (attack > dodge * 2)
            ? ""
            : (attack > dodge)
                ? ""
                : "DODGED!";
    }

    rollAll() {
        this.rollList
            .filter(rollSlot => rollSlot.rollable)
            .forEach(rollSlot => {
                rollSlot.roll();
            });
    }

    commit() {

        //early exit: no attack
        if (!isNumber(this.attackSlot.lastRoll) || !isNumber(this.dodgeSlot.lastRoll)) {
            return;
        }

        //early exit: no damage        
        if (this.attackSlot.Total > this.dodgeSlot.Total && !isNumber(this.damageSlot.lastRoll)) {
            return;
        }

        //will power cost: attack
        this.attacker.WillPower -= this._getCombinedWillPowerCost([
            this.attackSlot,
        ]);
        this.defender.WillPower -= this._getCombinedWillPowerCost([
            this.dodgeSlot,
        ]);

        //early exit: miss
        if (this.dodgeSlot.Total >= this.attackSlot.Total) {
            return;
        }

        //will power cost: damage
        this.attacker.WillPower -= this._getCombinedWillPowerCost([
            this.damageSlot,
        ]);
        this.defender.WillPower -= this._getCombinedWillPowerCost([
            this.durabilitySlot,
            this.painToleranceSlot,
            this.constitutionSlot,
        ]);

        //local vars
        const damage = this.damageTakenSlot.Total;

        //defender takes damage
        this.defender.Health -= damage;

        //defender gets wounded
        if (damage > this.durabilitySlot.Total) {
            this.defender.addWound(this.defender.species?.randomWound?.());
        }

        //defender gets winced
        if (damage > this.painToleranceSlot.Total) {
            this.defender.addCondition(CONDITION_STUNNED);
        }

        //defender goes unconscious
        if (this.defender.MissingHealth > this.constitutionSlot.Total) {
            this.defender.addCondition(CONDITION_UNCONSCIOUS);
        }
    }
    _getCombinedWillPowerCost(rollSlotList) {
        return arraySum(rollSlotList, (slot) => slot.WillPower);
    }
}
export default ActionRollAttack;

export function inflateActionRollAttack(actionRollAttack, characterList) {
    Object.setPrototypeOf(actionRollAttack, ActionRollAttack.prototype);

    const findCharacter = (name) => characterList.find(char => char.name == name);

    actionRollAttack.attacker = findCharacter(actionRollAttack.attackerName);
    actionRollAttack.defender = findCharacter(actionRollAttack.defenderName);

    let slotNameList = [
        "attackSlot",
        "dodgeSlot",
        "damageSlot",
        "damageTakenSlot",
        "durabilitySlot",
        "painToleranceSlot",
        "constitutionSlot",
    ];

    let oldSlotData = {};
    slotNameList.forEach(slotName => {
        oldSlotData[slotName] = actionRollAttack[slotName];
    });
    actionRollAttack.init();
    slotNameList.forEach(slotName => {
        actionRollAttack[slotName].acceptState(oldSlotData[slotName]);
    });
}
