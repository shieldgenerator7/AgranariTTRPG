"use strict";

import { clamp, randomRange } from "../Utility/Utility";
import Bonus from "./Bonus";

//2024-12-15: copied from https://stackoverflow.com/a/45709854/2336212
const SPLIT_LINE = /\r?\n/;

const STATS_NO_VARIANCE = [
    "Max Health",
    "Willpower",
    "Willpower Factor",
    "Crit Factor",
];

class Species{
    constructor(name) {
        this.name = name;
        this.adultAge = 21;

        this.baseStatList = [];

        this.statCostList = [];

    }

    getBaseStatBonus(character) {
        let age = character.age;
        let ageMax = this.adultAge;
        return this.baseStatList.map(baseStat =>
            new Bonus(baseStat.factor * clamp(age, 0, ageMax), baseStat.name, `Species - ${this.name}`)
        );
    }

    randomStatCosts() {
        let statCosts = {};
        this.statCostList.forEach(row => {
            //randomize value
            let min = row.min;
            let max = row.max;
            let val = randomRange(min, max);
            let avg = row.avg;

            let valvar = val / 5;

            //store value
            let name = row.name;
            statCosts[name] = val;
            if (!STATS_NO_VARIANCE.includes(name)) {
                statCosts[`${name} Variance`] = valvar;
            }
        })
        return statCosts;
    }
}
export default Species;



export function readSpeciesFromCSV(speciesName, csv) {

    let species = new Species(speciesName);

    //stat costs
    let statCostList = [];


    csv.split(SPLIT_LINE).forEach(line => {
        //early exit: table setup lines
        if (line.startsWith("Stat") || line.startsWith("---")) {
            return;
        }

        //get data
        let data = line.split(",").map(data => data?.trim());

        //early exit: end line
        if (data.length == 1 && !data[0]) {
            return;
        }

        //create stat cost
        let statCost = {
            name: data[0],
            min: data[1],
            avg: data[2],
            max: data[3],
        };
        statCostList.push(statCost);
    });

    species.statCostList = statCostList;

    return species;
}

