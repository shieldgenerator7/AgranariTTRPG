"use strict";

import RollSlot from "../RollSlot";
import { arraySum } from "../Utility/Utility";

class ActionRollAttack{
    constructor(attacker, defender) {
        this.attacker = attacker;
        this.defender = defender;

        this.attackSlot = new RollSlot(attacker, "accuracy");
        this.dodgeSlot = new RollSlot(defender, "dodge",(roll)=>getHitMessage(attackSlot.lastRoll, roll));
        this.damageSlot = new RollSlot(attacker, "damage");
        this.damageTakenSlot = new RollSlot(defender, "armor", () => damageSlot.lastRoll * defender.getStat("armor"));
        this.durabilitySlot = new RollSlot(defender, "durability", (roll)=>(damageTakenSlot.lastRoll > roll)?"WOUNDED":"");
        this.painToleranceSlot = new RollSlot(defender, "paintolerance", (roll)=>(damageTakenSlot.lastRoll > roll)?"WINCED":"");
        this.constitutionSlot = new RollSlot(defender, "constitution", (roll)=>(this.defender.MissingHealth + damageTakenSlot.lastRoll > roll)?"UNCONSCIOUS":"");

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
        return (attack > dodge * 2)
            ? "CRIT!"
            : (attack > dodge)
                ? "HIT"
                : "miss";
    }

    commit() {
        //will power cost: attack
        this.attacker.WillPower -= _getCombinedWillPowerCost([
            this.attackSlot,
        ]);
        this.defender.WillPower -= _getCombinedWillPowerCost([
            this.dodgeSlot,
        ]);

        //early exit: miss
        if (this.dodgeSlot.lastRoll >= this.attackSlot.lastRoll) {
            return;
        }

        //will power cost: damage
        this.attacker.WillPower -= _getCombinedWillPowerCost([
            this.damageSlot,
        ]);
        this.defender.WillPower -= _getCombinedWillPowerCost([
            this.durabilitySlot,
            this.painToleranceSlot,
            this.constitutionSlot,
        ]);

        //local vars
        const damage = this.damageTakenSlot.lastRoll;

        //defender takes damage
        this.defender.Health -= damage;

        //defender gets wounded
        if (damage > this.durabilitySlot.lastRoll) {
            this.defender.addWound(this.defender.species.randomWound());
        }

        //defender gets winced
        if (damage > this.painToleranceSlot.lastRoll) {
            this.defender.addCondition(CONDITION_STUNNED);
        }

        //defender goes unconscious
        if (this.defender.MissingHealth > this.constitutionSlot.lastRoll) {
            this.defender.addCondition(CONDITION_UNCONSCIOUS);
        }
    }
    _getCombinedWillPowerCost(rollSlotList) {
        return arraySum(rollSlotList, (slot) => slot.WillPower);
    }
}