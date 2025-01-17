"use strict";

import Ability from "../Data/Ability";

export function parsePasteFromExcel(pasteString) {
    let pasteSplit = pasteString.split("\n");
    let cardList = pasteSplit
        .map(str => parseCreatureTabLine(str))
        .filter(card => card);
    return cardList;
}

function parseCreatureTabLine(creatureTabLine) {
    //2024-03-03: setup to work with a specific Excel spreadsheet i have

    if (!creatureTabLine) { return; }

    let card = undefined;
    let fields = creatureTabLine.split("	").map(f => f.trim());
    const valid = (index) => fields[index] != undefined && fields[index] != "";

    //Species
    card.species = fields[0];

    //Tags
    if (valid(1)) {
        card.setTags(fields[1]);
    }

    //Base Power
    if (valid(5)) {
        card.basePower = fields[5];
    }

    //Biome Modifiers
    card.biomeModifiers = [];
    for (let i = 6; i < 16; i += 2) {
        if (valid(i) && valid(i + 1)) {
            let biomeName = fields[i];
            let biomeModifier = fields[i + 1] * 1;
            card.addBiomeModifier(biomeName, biomeModifier);
        }
    }

    //Abilities
    if (valid(16)) {
        let aname = fields[16] ?? "";
        let acost = fields[17] ?? 0;
        let areq = fields[18] ?? "";
        let atext = fields[19] ?? "";
        let ability = new Ability();
        ability.name = aname;

        let areqL = areq.split(",").map(r => r.trim());
        areqL.forEach(symbol => {
            //Cost: Exhaust
            if (/-[0-9]+/.test(symbol)) {//bug: allows extra letters around it
                ability.costName = "exhaust";
                ability.costX = symbol.match(/[0-9]+/)[0];
                return;
            }

            //Cost: Rest
            if (/\+[0-9]+R/.test(symbol)) {//bug: allows extra letters around it
                ability.costName = "rest";
                ability.costX = symbol.match(/[0-9]+/)[0];
                return;
            }
        });
        ability.effectName = "custom";
        ability.effectText = atext;
        ability.effectCost = acost;
        card.addAbility(ability);
    }

    //
    return card;
}
