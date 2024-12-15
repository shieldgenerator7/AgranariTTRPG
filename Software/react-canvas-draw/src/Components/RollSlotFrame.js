"use strict";

import Attribute from "../Data/Character";
import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import RollGroup from "../Data/RollGroup";
import { clamp, formatNumber, isNumber, isString } from "../Utility/Utility";
import Counter from "./Counter";
import Field from "./Field";

//2024-12-11: copied from AttributeFrame
function RollSlotFrame({ rollSlot, updateRollSlot }) {

    //TODO: add buttons and fields
    return (
        <tr className="rollSlotFrame">

            {/* Roll Button + Stat Name */}
            <td>
                {
                    rollSlot.rollable &&
                    <button className="plusMinus"
                        onClick={() => {
                            rollSlot.roll();
                            updateRollSlot();
                        }}
                    >
                        {rollSlot.label}:
                    </button>
                }
                {
                    !rollSlot.rollable &&
                    <span className="rollSlotLabel">
                        {rollSlot.label}:
                    </span>
                }
            </td>
            <td className="rollSlotCellNumber">
                {formatNumber(rollSlot.lastRoll)}
            </td>
            <td className="rollSlotCellNumber">
                {
                    rollSlot.lastRoll &&
                    <>
                        {
                            (!rollSlot.WillPower && rollSlot.goalFunc) &&
                            <button className="plusMinus"
                                onClick={() => {
                                    rollSlot.contestWithWillPower();
                                    updateRollSlot();
                                }}
                            >
                                WP
                            </button>
                        }
                        {
                            rollSlot.lastRoll && rollSlot.WillPower > 0 &&
                            <Counter
                                value={rollSlot.WillPower}
                                setValue={(value => {
                                    rollSlot.WillPower = value;
                                    updateRollSlot();
                                })}
                                label={`${(rollSlot.WillPower > 0) ? "+" : ""}${rollSlot.WillPower}`}
                                inline={true}
                                extraclass="willpower"
                            ></Counter>
                        }
                    </>
                }
            </td>
            <td>
                {
                    <span>{"-->"}</span>
                }
            </td>
            <td className="rollSlotCellNumber bold">
                {
                    <span>{formatNumber(rollSlot.Total)}</span>
                }
            </td>
            <td>{rollSlot.Status}</td>
        </tr>
    );

}
export default RollSlotFrame;
