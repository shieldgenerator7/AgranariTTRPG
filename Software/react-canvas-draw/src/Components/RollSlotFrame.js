"use strict";

"use strict";

import Attribute from "../Data/Character";
import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import RollGroup from "../Data/RollGroup";
import { clamp, isString } from "../Utility/Utility";
import Counter from "./Counter";
import Field from "./Field";

//2024-12-11: copied from AttributeFrame
function RollSlotFrame({ rollSlot, updateRollSlot }) {

    //TODO: add buttons and fields
    return (
        <div className="rollSlotFrame">
            
            <span>{rollSlot.stat.name}:</span> 
            <span> {rollSlot.lastRoll ?? "---"} </span>
            <span>{rollSlot.Status}</span>
            {/* TODO: Roll Button
            TODO: WillPower Button */}
        </div>
    );

}
export default RollSlotFrame;
