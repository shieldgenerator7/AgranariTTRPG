"use strict";

import AbilityFrame from "./AbilityFrame";
import Counter from "./Counter";
import Field from "./Field";

function ConsumableFrame({ consumableReference, character, updateCharacter, game, updateFunc, attributeAdjusted, abilityModified, diceRolled }) {
    let consumable = game.getConsumable(consumableReference.consumableName);
    let count = consumableReference.count;
    if (!consumable) {
        return `Consumable not found! ${consumableReference?.consumableName}`;
    }
    return <div>
        {!character.editAttributes &&
            <div>
                <Counter
                    value={count}
                    setValue={(v) => {
                        let diff = v - count;
                        character.addConsumable(consumable, diff);
                        updateCharacter(character);
                    }}
                    label={`x${count}`}
                    inline={true}
                ></Counter>
                <AbilityFrame
                    title={"Consumable"}
                    ability={consumable.ability}
                    updateFunc={() => {
                        updateCharacter(character);
                        updateFunc(consumable);
                    }}
                    character={character}
                    attributeAdjusted={attributeAdjusted}
                    abilityModified={abilityModified}
                    diceRolled={diceRolled}
                    showResourceCost={false}
                    inline={true}
                    activeFunc={() => consumableReference.active}
                    setActiveFunc={(b) => {
                        consumableReference.active = b;
                        if (consumableReference.count <= 0) {
                            character.addConsumable(consumable, 0);
                        }
                        updateCharacter(character);
                    }}
                ></AbilityFrame>
            </div>
        }
        {character.editAttributes &&
            <div>
                <AbilityFrame
                    title={"Consumable"}
                    ability={consumable.ability}
                    updateFunc={() => {
                        consumable.Name = consumable.ability.name;
                        updateFunc(consumable);
                    }}
                    character={character}
                    attributeAdjusted={attributeAdjusted}
                    abilityModified={abilityModified}
                    diceRolled={diceRolled}
                    showResourceCost={false}
                ></AbilityFrame>
            </div>
        }
    </div>;
}
export default ConsumableFrame;