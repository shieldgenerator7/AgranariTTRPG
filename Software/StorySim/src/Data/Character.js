"use strict";

import { inflateArray, clamp, arraySum, _normalizeForMatching } from "../Utility/Utility";
import Ability, { inflateAbility } from "./Actions/Ability";
import Stat, { inflateStat } from "./Stat";
import { STATS_NO_VARIANCE } from "./Species";

class Character {
    constructor(name, species) {
        this.name = name;
        this.portrait = undefined;//TODO: implement portrait
        this.statList = [];
        this.actionList = [];
        this.resourceList = {
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
        return value;
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

}
export default Character;
window.Character = Character;

//2024-09-20: copied from Creature.inflateCreature()
export function inflateCharacter(character, updateCharacter = (c) => { }) {
    Object.setPrototypeOf(character, Character.prototype);
    character.isCharacter = true;

    character.statList = inflateArray(character.statList, inflateStat);

    character.actionList = inflateArray(character.actionList, inflateAbility);

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
