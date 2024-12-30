"use strict";


import RollSlotFrame from "./RollSlotFrame";

/**
 * This component shows a list of rolls to be done for an action.
 * EX: For an attack, it'll display the roll to make for accuracy, dodge, etc, and have controls for willpower
 * @param {*} param0 
 * @returns 
 */
//2024-12-11: copied from CharacterFrame
function RollerFrame({ actionRoller, updateRoller, removeRoller, updateCharacter, game, updateGame, diceRolled, attributeAdjusted }) {

    const updateRollSlot = () => {
        updateRoller(actionRoller);
    };

    let prevChar = undefined;

    let rowList = [];
    actionRoller.rollList.forEach((rollSlot, i) => {
        if (rollSlot.character != prevChar) {
            prevChar = rollSlot.character;
            rowList.push((
                <tr className="rollSlotCharacterHeader" key={`header_${i}`}><td>
                    {rollSlot.character.name}
                </td></tr>
            ));
        }
        let row = (
            <RollSlotFrame
                rollSlot={rollSlot}
                updateRollSlot={updateRollSlot}
                key={`roller_${i}`}
            ></RollSlotFrame>
        );
        rowList.push(row);
    });

    return (
        <div className="actionFrame">
            <button className="headerButton"
                onClick={() => {
                    actionRoller.rollAll();
                    updateRoller(actionRoller);
                }}
            >
            {actionRoller.title}
            </button>
            <table>
                <tbody>
                    {
                        rowList
                    }
                </tbody>
            </table>
            <button className="commitButton"
                onClick={() => {
                    actionRoller.commit();
                    updateCharacter(actionRoller.attacker);
                    updateCharacter(actionRoller.defender);
                    updateRoller(actionRoller);
                    removeRoller(actionRoller);
                }}
            >COMMIT</button>

            {/* cancel button */}
            <button className="panelEx"
                onClick={() => {
                    removeRoller(actionRoller);
                }}
            >
                X
            </button>
        </div>
    );

}
export default RollerFrame;
