"use strict";

import RollSlot from "../RollSlot";

class ActionRollAttack{
    constructor(attacker, defender) {
        this.attacker = attacker;
        this.defender = defender;

        let attackSlot = new RollSlot(attacker, "accuracy");
        let dodgeSlot = new RollSlot(defender, "dodge",(roll)=>getHitMessage(attackSlot.lastRoll, roll));
        let damageSlot = new RollSlot(attacker, "damage");
        let damageTakenSlot = new RollSlot(defender, "armor", () => damageSlot.lastRoll * defender.getStat("armor"));
        let durabilitySlot = new RollSlot(defender, "durability", (roll)=>(damageTakenSlot.lastRoll > roll)?"WOUNDED":"");
        let painToleranceSlot = new RollSlot(defender, "paintolerance", (roll)=>(damageTakenSlot.lastRoll > roll)?"WINCED":"");
        let constitutionSlot = new RollSlot(defender, "constitution", (roll)=>(damageTakenSlot.lastRoll > roll)?"UNCONSCIOUS":"");

        this.rollList = [
            attackSlot,
            dodgeSlot,
            damageSlot,
            damageTakenSlot,
            durabilitySlot,
            painToleranceSlot,
            constitutionSlot,
        ];
    }

    getHitMessage(attack, dodge) {
        return (attack > dodge * 2)
            ? "CRIT!"
            : (attack > dodge)
                ? "HIT"
                : "miss";
    }
}