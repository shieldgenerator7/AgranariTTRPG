"use strict";

import { inflateArray, clamp, arraySum } from "../Utility/Utility";
import Ability, { inflateAbility } from "./Ability";
import { inflateStat } from "./Stat";
import { inflateConsumable } from "./Consumable";
import ConsumableReference, { inflateConsumableReference } from "./ConsumableReference";
import { inflateRollGroup } from "./RollGroup";
import { inflateBonus } from "./Bonus";

class Character {
    constructor(name) {
        this.name = name;
        this.portrait = undefined;//TODO: implement portrait
        this.statList = [];
        this.abilityList = [];
        this.consumableList = [];
        this.tempBonusList = [];
        this.resources = {
            health: 100,
            willPower: 20,
        };

        //TODO: implement equipment
        this.equipmentList = [];
        //TODO: implement consumables
        this.consumableList = [];

        this.restList = [];//TOOD: implement rests
        this.dieRollLog = [];
        this.dieRollLogSelect = [];

        this.isCharacter = true;
    }

    _normalizeForMatching(name) {
        return name?.trim().replaceAll(" ", "").toLowerCase();
    }

    getStat(statName) {
        statName = this._normalizeForMatching(statName);
        if (!statName) {
            console.error("statname must be a name of a stat! statName: ", statName);
            return;
        }
        return this.statList
            .find(a => this._normalizeForMatching(a.name) == statName || this._normalizeForMatching(a.displayName) == statName);
    }

    getStatValue(statName) {
        let value = this.getStat(statName)?.Stat ?? 0;
        let bonusList = this.getBonusList(statName);
        return value + arraySum(bonusList, bonus => bonus.bonus);
    }

    getMaxStatName(resourceName) {
        resourceName = this._normalizeForMatching(resourceName);
        let stat = this.statList
            .find(a => this._normalizeForMatching(a.name).includes(resourceName) || this._normalizeForMatching(a.displayName).includes(resourceName));
        return stat?.name;
    }

    get Health() {
        return this.resources.health;
    }
    set Health(value) {
        this.resources.health = clamp(value, 0, this.getStatValue("maxhealth"));
    }
    get MissingHealth() {
        return this.getStatValue("maxhealth") - this.resources.health;
    }

    get WillPower() {
        return this.resources.willPower;
    }
    set WillPower(value) {
        this.resources.willPower = clamp(value, 0, this.getStatValue("willpower"));
    }

    get XPTotal() {
        return arraySum(this.statList, stat => stat.XPTotal);//TODO: also calculate XP cost of features
    }

    addCondition() {
        console.error("Method not implemented yet!");
        return;
    }

    addWound() {
        console.error("Method not implemented yet!");
        return;        
    }

    getConsumable(cnsmName) {
        cnsmName = cnsmName.trim();
        return this.consumableList.find(cr => cr.consumableName == cnsmName);
    }

    hasResource(ability) {
        console.error("Method not re-implemented yet!");
        return;
        //Attributes
        let attr = this.getStat(ability.resourceName);
        if (attr && attr.value >= ability.resourceCost) {
            return true;
        }
        //Consumables
        let conRef = this.getConsumable(ability.resourceName);
        if (conRef && conRef.count >= ability.resourceCost) {
            return true;
        }
        //Default
        return false;
    }

    consumeResource(ability) {
        console.error("Method not re-implemented yet!");
        return;
        //Attributes
        let attr = this.getStat(ability.resourceName);
        if (attr) {
            let prevValue = attr.Value;
            attr.Value -= ability.resourceCost;
            return [prevValue, attr.Value];
        }
        //Consumables
        let conRef = this.getConsumable(ability.resourceName);
        if (conRef) {
            let prevCount = conRef.count;
            conRef.count -= ability.resourceCost;
            return [prevCount, conRef.count];
        }
        //Default
        return [0, 0];
    }

    addConsumable(consumable, count) {
        let consumableReference = this.getConsumable(consumable.name);
        if (!consumableReference) {
            //early exit: theres none to add, and its not in the list
            if (count == 0) {
                return;
            }
            consumableReference = new ConsumableReference(consumable.name, 0);
            this.consumableList.push(consumableReference);
        }
        consumableReference.count += count;
        if (consumableReference.count <= 0 && !consumableReference.active) {
            let index = this.consumableList.indexOf(consumableReference);
            this.consumableList.splice(index, 1);
        }
    }

    getBonusList(statName) {
        statName = this._normalizeForMatching(statName);
        return this.tempBonusList.filter(
            bonus => this._normalizeForMatching(bonus.filter).includes(statName)
        );
    }

}
export default Character;
window.Character = Character;

//2024-09-20: copied from Creature.inflateCreature()
export function inflateCharacter(character, updateCharacter = (c) => { }) {
    Object.setPrototypeOf(character, Character.prototype);
    character.isCharacter = true;

    character.statList = inflateArray(character.statList, inflateStat);

    character.abilityList = inflateArray(character.abilityList, inflateAbility);

    character.consumableList = inflateArray(character.consumableList, inflateConsumableReference);

    character.tempBonusList = inflateArray(character.tempBonusList, inflateBonus);

    character.dieRollLog = inflateArray(character.dieRollLog, inflateRollGroup);
    character.dieRollLogSelect = inflateArray(character.dieRollLogSelect, () => { });

    character.resources ??= {
        health: 100,
        willPower: 20,
    };
    character.resources.health ||= 0;
    character.resources.willPower ||= 0;

    //Portrait
    // if (character.imageURL && !isImage(character.imgPortrait)) {
    //     let characterImage = new Image();
    //     characterImage.src = character.imageURL;
    //     characterImage.onload = () => {
    //         character.imgPortrait = characterImage;
    //         updateCharacter(character);
    //     }
    // }
}
export function backwardsCompatifyCharacter(character) {
}
