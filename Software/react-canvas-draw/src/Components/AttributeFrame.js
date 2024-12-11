"use strict";

"use strict";

import Attribute from "../Data/Character";
import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import RollGroup from "../Data/RollGroup";
import { clamp, isString } from "../Utility/Utility";
import Counter from "./Counter";
import Field from "./Field";

function AttributeFrame({ stat, character, updateCharacter, game, diceRolled, attributeAdjusted }) {
    let onClickType = stat.OnClickType;
    //Edit Attributes
    if (character.editAttributes) {
        return (
            <div className="abilityFrameEdit">
                <div className="abilityFrameLine">
                    {/* Name */}
                    <Field
                        name={"Stat"}
                        value={stat.name}
                        setValue={(value) => {
                            attributeAdjusted(character, `${stat.name}_name`, stat.name, value);
                            stat.name = value;
                            updateCharacter(character);
                        }}
                        className={"editText"}
                    ></Field>
                    {/* Display Name */}
                    <Field
                        name={"Display"}
                        value={stat.displayName}
                        setValue={(value) => {
                            attributeAdjusted(character, `${stat.name}_displayname`, stat.displayName, value);
                            stat.displayName = value;
                            updateCharacter(character);
                        }}
                        className={"editTextShort"}
                        placeHolder={stat.name}
                    ></Field>
                </div>
                <div className="abilityFrameLine">
                    {/* XP */}
                    <Counter
                        value={stat.XP}
                        setValue={(value) => {
                            attributeAdjusted(character, `${stat.name}`, stat.Stat, value);
                            stat.XP = value;
                            updateCharacter(character);
                        }}
                        label={"XP"}
                        showEditField={true}
                        min={0}
                        max={0}
                        inline={true}
                    ></Counter>
                    {/* Variance XP */}
                    <Counter
                        value={stat.XPVariance}
                        setValue={(value) => {
                            attributeAdjusted(character, `${stat.name}_variance`, stat.StatVariance, value);
                            stat.XPVariance = value;
                            updateCharacter(character);
                        }}
                        label={"Var. XP"}
                        showEditField={true}
                        min={0}
                        max={0}
                        inline={true}
                    ></Counter>
                    {/* Stat Cost */}
                    <Field
                        name={"Stat Cost"}
                        value={stat.statCost}
                        setValue={(value) => {
                            attributeAdjusted(character, `${stat.name}_statCost`, stat.statCost, value);
                            stat.acceptStatCost(value);
                            updateCharacter(character);
                        }}
                        className={"editTextShort"}
                    ></Field>
                </div>
            </div>
        );
    }
    //Button controls
    else {
        return (
            <div className="abilityFrame">
                <span>
                    {onClickType == ONCLICK_ADJUST_VALUE &&
                        <span>
                            <Counter
                                value={stat.value}
                                setValue={(v) => {
                                    let oldValue = stat.value;
                                    stat.value = v;
                                    updateCharacter(character);
                                    attributeAdjusted(character, stat.name, oldValue, v);
                                }}
                                allowNegative={false}
                                inline={true}
                                min={0}
                                max={stat.max}
                                label={stat.getDisplayText()}
                            ></Counter>
                        </span>
                    }
                    {(true || onClickType == ONCLICK_DIE_ROLL) &&
                        <span>
                            <button className={"plusMinus"}
                                onClick={
                                    () => {
                                        let roll = rollDice(`1d${stat.StatVariance}`);
                                        roll.name = stat.name;
                                        let originalResult = roll.Value;
                                        roll.addRoll(stat.name, stat.Stat * 1);
                                        diceRolled(character, stat.name, originalResult, roll.Value);

                                        //roll ability dice, if applicable
                                        let abilityList = character.abilityList
                                            .filter(ability => ability.Active);
                                        abilityList = abilityList.concat(
                                            character.consumableList.filter(c => c.active)
                                                .map(c => game.getConsumable(c.consumableName)?.ability)
                                        );
                                        abilityList = abilityList.filter(ability => ability?.action == ACTION_ROLL_MODIFY);
                                        abilityList
                                            .forEach(ability => {
                                                let ablname = `${stat.name} (+${ability.name})`;
                                                //early exit: stat filter
                                                if (ability.dieRollAttributeFilter) {
                                                    if (ability.dieRollAttributeFilter != stat.name) {
                                                        return;
                                                    }
                                                }
                                                //bonus: dice roll
                                                if (("" + ability.dieRollBonus).includes("d")) {
                                                    let bonusroll = rollDice(ability.dieRollBonus);
                                                    bonusroll.name = ability.name;
                                                    bonusroll.rollList.forEach(roll => roll.name += ` ${ability.name}`);
                                                    roll.rollList = roll.rollList.concat(bonusroll.rollList);
                                                    diceRolled(character, ablname, bonusroll.Value, roll.Value);
                                                }
                                                //bonus: constant
                                                else if (ability.dieRollBonus * 1 > 0) {
                                                    let bonusvalue = ability.dieRollBonus * 1;
                                                    roll.addRoll(ability.name, bonusvalue);
                                                    diceRolled(character, ablname, bonusvalue, roll.Value);
                                                }
                                                //bonus: Attribute
                                                else if (isString(ability.dieRollBonus)) {
                                                    let attrName = ability.dieRollBonus.trim();
                                                    let attr = character.statList
                                                        .filter(a => a.name?.trim() == attrName || a.displayName?.trim() == attrName)[0];
                                                    if (attr?.value) {
                                                        let bonusvalue = attr.value * 1;
                                                        roll.addRoll(`${attr.name} (${ability.name})`, bonusvalue);
                                                        diceRolled(character, ablname, bonusvalue, roll.Value);
                                                    }
                                                }
                                            });

                                        //add bonuses, if applicable
                                        let tempBonusList = character.tempBonusList.filter(tempBonus => !tempBonus.filter || tempBonus.filter.trim() == stat.name.trim());
                                        tempBonusList.forEach(tempBonus => {
                                            roll.addRoll("Temp Bonus", tempBonus.bonus);
                                            diceRolled(character, "Temp Bonus", tempBonus.bonus, roll.Value);
                                        });

                                        //store roll in temp var
                                        stat.lastRoll = roll.Value;
                                        updateCharacter(character);

                                        //record roll
                                        character.dieRollLog.push(roll);
                                        character.dieRollLogSelect.length = 0;
                                        character.dieRollLogSelect.push(character.dieRollLog.length - 1);
                                        updateCharacter(character);
                                    }
                                }
                                onContextMenu={
                                    (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        updateCharacter(character);
                                        return false;
                                    }
                                }
                            >{`${stat.getDisplayText()}`}</button>
                        </span>
                    }
                    {
                        stat.OnClickType == ONCLICK_TOGGLE &&
                        <span>
                            {stat.getDisplayText()}
                        </span>
                    }
                </span>
            </div>
        );
    }
}
export default AttributeFrame;
