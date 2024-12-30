"use strict";

import { inflateArray, clamp, arraySum, _normalizeForMatching } from "../Utility/Utility";
import Ability, { inflateAbility } from "./Ability";
import Stat, { inflateStat } from "./Stat";
import { inflateConsumable } from "./Consumable";
import ConsumableReference, { inflateConsumableReference } from "./ConsumableReference";
import { inflateRollGroup } from "./RollGroup";
import { inflateBonus } from "./Bonus";
import { STATS_NO_VARIANCE } from "./Species";

class Character {
    constructor(name, species) {
        this.name = name;
        this.portrait = undefined;//TODO: implement portrait
        this.statList = [];
        this.abilityList = [];
        this.consumableList = [];
        this.bonusList = [];
        this.resources = {
            health: 100,
            willPower: 20,
        };

        //species setup
        this.species = species;
        if (species) {
            this.speciesName = species?.name;
            this.statCosts = species.randomStatCosts();
            this.statList = Object.entries(this.statCosts)
                .map(([k, v]) => {
                    let stat = new Stat(k, v);
                    if (STATS_NO_VARIANCE.includes(k)) {
                        stat.hasVariance = false;
                    }
                    stat.XP = 100;
                    if (stat.hasVariance) {
                        stat.XPVariance = 100;
                    }
                    return stat;
                });
        }
        //

        //TODO: implement equipment
        this.equipmentList = [];
        //TODO: implement consumables
        this.consumableList = [];

        this.restList = [];//TOOD: implement rests
        this.dieRollLog = [];
        this.dieRollLogSelect = [];

        this.isCharacter = true;
    }

    getStat(statName) {
        statName = _normalizeForMatching(statName);
        if (!statName) {
            console.error("statname must be a name of a stat! statName: ", statName);
            return;
        }
        return this.statList
            .find(a => _normalizeForMatching(a.name) == statName || _normalizeForMatching(a.displayName) == statName);
    }

    getStatValue(statName) {
        let value = this.getStat(statName)?.Stat ?? 0;
        let bonusList = this.getBonusList(statName);
        return value + arraySum(bonusList, bonus => bonus.amount);
    }

    getMaxStatName(resourceName) {
        resourceName = _normalizeForMatching(resourceName);
        let stat = this.statList
            .find(a => _normalizeForMatching(a.name).includes(resourceName) || _normalizeForMatching(a.displayName).includes(resourceName));
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
        statName = _normalizeForMatching(statName);
        return this.bonusList.filter(
            bonus => _normalizeForMatching(bonus.filter).includes(statName)
        );
    }

    getHitChance(character) {
        //2024-12-15: using formula from https://math.stackexchange.com/a/5009147/308576
        let acc = this.getStatValue("accuracy");
        let accvar = this.getStat("accuracy").StatVariance;
        let dodge = this.getStatValue("dodge");
        let dodgevar = this.getStat("dodge").StatVariance;

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

    character.bonusList = inflateArray(character.bonusList, inflateBonus);

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
