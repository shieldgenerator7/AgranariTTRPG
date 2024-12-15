"use strict";

import { useState } from "react";
import Ability, { inflateAbility } from "../Data/Ability";
import Stat, { inflateStat } from "../Data/Stat";
import Character from "../Data/Character";
import { DIE_ROLL_FLAIR_CRIT, DIE_ROLL_FLAIR_FUMBLE } from "../Data/Constants";
import Consumable from "../Data/Consumable";
import { rollDice } from "../Data/DiceRoller";
import AbilityFrame from "./AbilityFrame";
import AttributeFrame from "./AttributeFrame";
import ConsumableFrame from "./ConsumableFrame";
import Field from "./Field";
import ListOrdered from "./ListOrdered";
import SearchSelect from "./SearchSelect";
import { isString } from "../Utility/Utility";
import TempBonus from "../Data/TempBonus";
import TempBonusFrame from "./TempBonusFrame";

/**
 * This component shows a list of rolls to be done for an action.
 * EX: For an attack, it'll display the roll to make for accuracy, dodge, etc, and have controls for willpower
 * @param {*} param0 
 * @returns 
 */
//2024-12-11: copied from CharacterFrame
function RollerFrame({ title, actionRoller, updateCharacter, game, updateGame, diceRolled, attributeAdjusted }) {
   
    return (
        <div className="actionFrame">
            {title}
            {
                actionRoller.rollList.map((rollSlot,i) => 
                (<div key={i}>{ rollSlot.getDisplayText() }</div>)
                )
            }
        </div>
    );

}
export default RollerFrame;
