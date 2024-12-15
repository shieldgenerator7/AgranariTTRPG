"use strict";

import Attribute from "../Data/Character";
import { ACTION_ROLL_MODIFY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE } from "../Data/Constants";
import { rollDice } from "../Data/DiceRoller";
import RollGroup from "../Data/RollGroup";
import { clamp, isNumber, isString } from "../Utility/Utility";
import Counter from "./Counter";
import Field from "./Field";

//2024-12-11: copied from AttributeFrame
function RollSlotFrame({ rollSlot, updateRollSlot }) {

    //TODO: add buttons and fields
    return (
        <tr className="rollSlotFrame">

            <td>{rollSlot.stat.name}:</td>
            <td>
                <button
                    onClick={() => {
                        rollSlot.roll();
                        updateRollSlot();
                    }}
                >
                    ROLL
                </button>
            </td>
            <td> {Math.cut(rollSlot.lastRoll) ?? "---"} </td>
            <td>
                {
                    rollSlot.lastRoll &&
                    <>
                        {
                            (!rollSlot.WillPower && rollSlot.goalFunc) &&
                            <button
                                onClick={() => {
                                    rollSlot.contestWithWillPower();
                                    updateRollSlot();
                                }}
                            >
                                WP
                            </button>
                        }
                        {
                            rollSlot.lastRoll && rollSlot.WillPower &&
                            <Counter
                                value={rollSlot.WillPower}
                                setValue={(value => {
                                    rollSlot.WillPower = value;
                                    updateRollSlot();
                                })}
                                label={`${(rollSlot.WillPower > 0) ? "+" : ""}${rollSlot.WillPower}`}
                                inline={true}
                            ></Counter>
                        }
                    </>
                }
            </td>
            <td>
                {
                    rollSlot.lastRoll && rollSlot.WillPower &&
                    <span>{"-->"} {Math.cut(rollSlot.Total)}</span>
                }
            </td>
            <td>{rollSlot.Status}</td>
        </tr>
    );

}
export default RollSlotFrame;
