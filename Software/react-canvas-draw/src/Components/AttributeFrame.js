"use strict";

"use strict";

import Attribute from "../Data/Character";
import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import RollGroup from "../Data/RollGroup";
import { clamp, isString } from "../Utility/Utility";
import Counter from "./Counter";
import Field from "./Field";

function AttributeFrame({ attribute, character, updateCharacter, game, diceRolled, attributeAdjusted }) {
    let onClickType = attribute.OnClickType;
    //Edit Attributes
    if (character.editAttributes) {
        return (
            <div className="abilityFrameEdit">
                <div className="abilityFrameLine">
                    {/* Name */}
                    <Field
                        name={"Stat"}
                        value={attribute.name}
                        setValue={(value) => {
                            attributeAdjusted(character, `${attribute.name}_name`, attribute.name, value);
                            attribute.name = value;
                            updateCharacter(character);
                        }}
                        className={"editText"}
                    ></Field>
                    {/* Display Name */}
                    <Field
                        name={"Display"}
                        value={attribute.displayName}
                        setValue={(value) => {
                            attributeAdjusted(character, `${attribute.name}_displayname`, attribute.displayName, value);
                            attribute.displayName = value;
                            updateCharacter(character);
                        }}
                        className={"editTextShort"}
                        placeHolder={attribute.name}
                    ></Field>
                </div>
                <div className="abilityFrameLine">
                    {/* XP */}
                    <Counter
                        value={attribute.XP}
                        setValue={(value) => {
                            attributeAdjusted(character, `${attribute.name}`, attribute.Stat, value);
                            attribute.XP = value;
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
                        value={attribute.XPVariance}
                        setValue={(value) => {
                            attributeAdjusted(character, `${attribute.name}_variance`, attribute.StatVariance, value);
                            attribute.XPVariance = value;
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
                        value={attribute.statCost}
                        setValue={(value) => {
                            attributeAdjusted(character, `${attribute.name}_statCost`, attribute.statCost, value);
                            attribute.acceptStatCost(value);
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
                                value={attribute.value}
                                setValue={(v) => {
                                    let oldValue = attribute.value;
                                    attribute.value = v;
                                    updateCharacter(character);
                                    attributeAdjusted(character, attribute.name, oldValue, v);
                                }}
                                allowNegative={false}
                                inline={true}
                                min={0}
                                max={attribute.max}
                                label={attribute.getDisplayText()}
                            ></Counter>
                        </span>
                    }
                    {(true || onClickType == ONCLICK_DIE_ROLL) &&
                        <span>
                            <button className={"plusMinus"}
                                onClick={
                                    () => {
                                        let roll = rollDice(`1d${attribute.StatVariance}`);
                                        roll.name = attribute.name;
                                        let originalResult = roll.Value;
                                        roll.addRoll(attribute.name, attribute.Stat * 1);
                                        diceRolled(character, attribute.name, originalResult, roll.Value);

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
                                                let ablname = `${attribute.name} (+${ability.name})`;
                                                //early exit: attribute filter
                                                if (ability.dieRollAttributeFilter) {
                                                    if (ability.dieRollAttributeFilter != attribute.name) {
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
                                                    let attr = character.attributeList
                                                        .filter(a => a.name?.trim() == attrName || a.displayName?.trim() == attrName)[0];
                                                    if (attr?.value) {
                                                        let bonusvalue = attr.value * 1;
                                                        roll.addRoll(`${attr.name} (${ability.name})`, bonusvalue);
                                                        diceRolled(character, ablname, bonusvalue, roll.Value);
                                                    }
                                                }
                                            });

                                        //add bonuses, if applicable
                                        let tempBonusList = character.tempBonusList.filter(tempBonus => !tempBonus.filter || tempBonus.filter.trim() == attribute.name.trim());
                                        tempBonusList.forEach(tempBonus => {
                                            roll.addRoll("Temp Bonus", tempBonus.bonus);
                                            diceRolled(character, "Temp Bonus", tempBonus.bonus, roll.Value);
                                        });

                                        //store roll in temp var
                                        attribute.lastRoll = roll.Value;
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
                            >{`${attribute.getDisplayText()}`}</button>
                        </span>
                    }
                    {
                        attribute.OnClickType == ONCLICK_TOGGLE &&
                        <span>
                            {attribute.getDisplayText()}
                        </span>
                    }
                </span>
            </div>
        );
    }
}
export default AttributeFrame;
