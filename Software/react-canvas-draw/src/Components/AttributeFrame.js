"use strict";

"use strict";

import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import { clamp, isString, formatNumber } from "../Utility/Utility";
import Counter from "./Counter";

function AttributeFrame({ stat, character, updateCharacter, game, socket, diceRolled, attributeAdjusted }) {
    let onClickType = stat.OnClickType;
    //Edit Attributes
    if (character.editAttributes) {
        return (
            <div className="abilityFrameEdit">
                <div className="abilityFrameLine">
                    {/* Name */}
                    <div className="textline">
                        {stat.name} = {formatNumber(stat.Stat)} {(stat.hasVariance) ? `+ d${formatNumber(stat.StatVariance)}` : ""}
                    </div>
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
                    {stat.hasVariance &&
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
                    }
                    {/* Stat Cost */}
                    {/* <div className="textline">
                        ({formatNumber(stat.statCost) } xp/pt)
                    </div> */}
                </div>
            </div>
        );
    }
    //Button controls
    else {
        return (
            <tr className="statRow">
                <td>{stat.name}:</td>
                <td>
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
                                            let statName = ability.dieRollBonus.trim();
                                            let attr = character.statList
                                                .filter(a => a.name?.trim() == statName || a.displayName?.trim() == statName)[0];
                                            if (attr?.value) {
                                                let bonusvalue = attr.value * 1;
                                                roll.addRoll(`${attr.name} (${ability.name})`, bonusvalue);
                                                diceRolled(character, ablname, bonusvalue, roll.Value);
                                            }
                                        }
                                    });

                                //add bonuses, if applicable
                                let bonusList = character.bonusList.filter(tempBonus => !tempBonus.filter || tempBonus.filter.trim() == stat.name.trim());
                                bonusList.forEach(tempBonus => {
                                    roll.addRoll("Bonus", tempBonus.amount);
                                    diceRolled(character, "Bonus", tempBonus.amount, roll.Value);
                                });

                                //store roll in temp var
                                stat.lastRoll = roll.Value;
                                updateCharacter(character);

                                //record roll
                                character.dieRollLog.push(roll);
                                character.dieRollLogSelect.length = 0;
                                character.dieRollLogSelect.push(character.dieRollLog.length - 1);
                                updateCharacter(character);

                                //network roll
                                socket.emit(
                                    "onDiceRolled",
                                    {
                                        characterName: character.name,
                                        statName: stat.name,
                                        roll: stat.lastRoll,
                                    }
                                );
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
                    >{`${formatNumber(stat.Stat)} ${(stat.hasVariance) ? ` + d${formatNumber(stat.StatVariance)}` : ""}`}</button>
                    {/* = {stat.lastRoll} */}
                </td>
            </tr>
        );
    }
}
export default AttributeFrame;
