"use strict";

import { between, isNumber } from "../../Utility/Utility";
import { biomeList } from "../BiomeModifier";
import Ability from "./Ability";
import AbilityAtom from "./AbilityAtom";
import { LINETYPE_COST, LINETYPE_EFFECT, LINETYPE_REQUIREMENT, LINETYPE_TRIGGER, TYPE_PARAM_BIOME, TYPE_PARAM_BIOMEMOD, TYPE_PARAM_CREATURE, TYPE_PARAM_LAND, TYPE_PARAM_LOCATION, TYPE_PARAM_TYPE, TYPE_PARAM_NUMBER_WHOLE, TYPE_PARAM_TEAM, TYPE_PARAM_STRING, TYPE_PARAM_NUMBER_FRACTION } from "./AbilityConstants";
import AbilityToken from "./AbilityToken";
import StringReplacement from "./StringReplacement";

const topList = [
    "custom",
    "custom-cost",
    "custom-trigger",
    "custom-requirement",
    "custom-effect",
    "none",
    "choose",
];
const lineTypeOrder = [
    LINETYPE_COST,
    LINETYPE_TRIGGER,
    LINETYPE_REQUIREMENT,
    LINETYPE_EFFECT,
];
function sortFunc(_a, _b) {
    if (_a.name == "choose") {
        return -1;
    }
    if (_b.name == "choose") {
        return 1;
    }
    if (_a.type != _b.type) {
        return (lineTypeOrder.indexOf(_a.type) - lineTypeOrder.indexOf(_b.type));
    }
    let a = _a.name;
    let b = _b.name;
    const topA = topList.includes(a);
    const topB = topList.includes(b);
    if (topA && !topB) {
        return -1;
    }
    if (!topA && topB) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

//DEPRECATED: don't use!
export const abilityEffects = [
    new AbilityAtom(
        "attack-type-enemy",
        "Choose a type. Deal X damage to all enemy Creatures of that type.",
        (x) => x * 1.5
    ),
    new AbilityAtom(//danger: exploitable! esp when only paired with exhaust cost
        "attack-lifesteal",
        "Deal X damage to target Creature. Heal for the damage done.",
        (x) => x * 2
    ),
    new AbilityAtom(
        "duplicate",
        "Create a duplicate of target Creature until the end of the round. At the end of the round, add X Rest counters to that Creature.",
        (x) => 5 - x * 1.5
    ),
    new AbilityAtom(
        "absorb",
        "If this Creature would take damage, it heals that amount instead.",
        (x) => 10
    ),
    new AbilityAtom(
        "ward-any",
        "Target Creature has Ward X.",
        (x) => x * 1.1
    ),
].sort(sortFunc);

//DEPRECATED: don't use!
export const abilityRequirements = [
    new AbilityAtom(
        "target-rest-count",
        "Target Creature must have at least X Rest counters on it.",
        (x, c) => c - x * 2,
        "RX?"
    ),
    new AbilityAtom(
        "target-type-share",
        "Target Creature must share at least X types with this Creature.",
        (x, c) => c / Math.max(1, x + 1),
        "t-TX?"
    ),
    new AbilityAtom(
        "targeter-type-share",
        "The targeter must share at least X types with this Creature.",
        (x, c) => c / Math.max(1, x + 1),
        "tr-TX?"
    ),
].sort(sortFunc);




export const abilityTokens = [
    new AbilityToken(
        TYPE_PARAM_CREATURE,
        undefined,
        [
            "target-creature",
            "all-creature",
            "self-creature",
            "nonself-creature",
            "triggering-creature",
            "that-creature",
        ],
        TYPE_PARAM_TEAM
    ),
    new AbilityToken(
        TYPE_PARAM_TEAM,
        undefined,
        [
            "all-team",
            "ally-team",
            "enemy-team",
            "neutral-team",
            "target-team",
            "that-team",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_LAND,
        undefined,
        [
            "target-land",
            "all-land",
            "this-land",
            "that-land",
            "scouted-land",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_BIOME,
        undefined,
        [
            "target-biome",
            "all-biome",
            "none-biome",
            "that-biome",
            "specific-biome",
            "scouted-biome",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_BIOMEMOD,
        undefined,
        [
            "target-biomemod",
            "all-biomemod",
            "none-biomemod",
            "that-biomemod",
            "specific-biomemod",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_LOCATION,
        undefined,
        [
            "target-location",
            "all-location",
            "land-location",
            "ready-location",
            "deploy-location",
            "returning-location",
            "resting-location",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_NUMBER_WHOLE,
        1,
        (x) => isNumber(x)
    ),
    new AbilityToken(
        TYPE_PARAM_NUMBER_FRACTION,
        0.1,
        (x) => isNumber(x) && between(x, 0, 1)
    ),
    new AbilityToken(
        TYPE_PARAM_TYPE,
        undefined,
        [
            "target-type",
            "all-type",
            "none-type",
            "that-type",
            "specific-type",
        ]
    ),
    new AbilityToken(
        TYPE_PARAM_STRING,
        "text"
    ),
    new AbilityToken(
        "specific-biome",
        undefined,
        biomeList
    ),
    new AbilityToken(
        "specific-biomemod",
        undefined,
        biomeList
    ),
    new AbilityToken(
        "specific-type",
        undefined,
        biomeList
    ),
];
abilityTokens
    .filter(token => token.subtokenname)
    .forEach(token => {
        let subtoken = abilityTokens.find(t => t.name == token.subtokenname);
        token.init(subtoken);
    });

export const abilityAtoms = [

    //custom / choose
    [
        new AbilityAtom(
            "choose",
            "",
            LINETYPE_EFFECT,
            {},
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "custom-cost",
            "{line}",
            LINETYPE_COST,
            {
                line: TYPE_PARAM_STRING,
                discount: TYPE_PARAM_NUMBER_WHOLE,
                discountFactor: TYPE_PARAM_NUMBER_WHOLE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "custom-trigger",
            "{line}",
            LINETYPE_TRIGGER,
            {
                line: TYPE_PARAM_STRING,
                discount: TYPE_PARAM_NUMBER_WHOLE,
                discountFactor: TYPE_PARAM_NUMBER_WHOLE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "custom-requirement",
            "{line}",
            LINETYPE_REQUIREMENT,
            {
                line: TYPE_PARAM_STRING,
                discount: TYPE_PARAM_NUMBER_WHOLE,
                discountFactor: TYPE_PARAM_NUMBER_WHOLE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "custom-effect",
            "{line}",
            LINETYPE_EFFECT,
            {
                line: TYPE_PARAM_STRING,
                cost: TYPE_PARAM_NUMBER_WHOLE,
            },
            {
                keywordable: false,
            }
        ),
    ],

    //costs
    [
        new AbilityAtom(
            "exhaust",
            "reduce this creature's power by {cost}",
            LINETYPE_COST,
            {
                cost: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "rest",
            "add {rest} rest counters to this Creature",
            LINETYPE_COST,
            {
                rest: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "discard",
            "move {count} cards from your hand to your returning pile",
            LINETYPE_COST,
            {
                count: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "sacrifice",
            "reduce the power of {count} target creatures you control to 0",
            LINETYPE_COST,
            {
                count: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "tap",
            "tap {tap} lands",
            LINETYPE_COST,
            {
                tap: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
    ],

    //triggers
    [
        new AbilityAtom(
            "ambush",
            "when an enemy creature enters the battlefield",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "greeting",
            "when another ally creature enters the battlefield",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "battlecry",
            "when this creature enters the battlefield",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "revenge",
            "when this creature is reduced to 0 power",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "avenge",
            "when another ally creature is reduced to 0 power",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "targeted-by-ally",
            "when this creature is targeted by another ally's ability",
            LINETYPE_TRIGGER,
            {},
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "targeted-by-enemy",
            "when this creature is targeted by an enemy's ability",
            LINETYPE_TRIGGER,
            {},
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "intercept",
            "when an ability targets another ally",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "retaliate",
            "when this creature takes damage",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "other-takes-damage",
            "when another creature takes damage",
            LINETYPE_TRIGGER,
            {},
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "dawn",
            "when the battle begins",
            LINETYPE_TRIGGER,
            {}
        ),
        new AbilityAtom(
            "dusk",
            "when the battle ends",
            LINETYPE_TRIGGER,
            {}
        ),
    ],

    //requirements
    [
        new AbilityAtom(
            "home",
            "this creature must be in a home biome",
            LINETYPE_REQUIREMENT,
            {}
        ),
        new AbilityAtom(
            "once",
            "this ability may only {actionWord} once per battle",
            LINETYPE_REQUIREMENT,
            {
                actionWord: ["activate", "trigger"],
            }
        ),
        new AbilityAtom(
            "channel",
            "if this creature takes damage before this ability effect resolves, the effect is interrupted",
            LINETYPE_REQUIREMENT,
            {}
        ),
        new AbilityAtom(
            "social",
            "this creature must have at least {count} allies that share a type with it, including itself",
            LINETYPE_REQUIREMENT,
            {
                count: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "symbiotic",
            "target creature must share at least {count} home biomes with this creature",
            LINETYPE_REQUIREMENT,
            {
                count: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "slow",
            "this ability cannot be used to react to another ability",
            LINETYPE_REQUIREMENT,
            {}
        ),
        new AbilityAtom(
            "powerful",
            "this creature must have at least {power} power",
            LINETYPE_REQUIREMENT,
            {
                power: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
    ],

    //effects
    [
        new AbilityAtom(
            "attack",
            "deal {damage} damage to {target}",
            LINETYPE_EFFECT,
            {
                damage: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "block",
            "reduce incoming damage by {block}",
            LINETYPE_EFFECT,
            {
                block: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "move",
            "move {target} from {from} to {to}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
                from: [TYPE_PARAM_LAND, TYPE_PARAM_LOCATION],
                to: [TYPE_PARAM_LAND, TYPE_PARAM_LOCATION],
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "scout",
            "reveal the top {distance} lands from the land deck, choose one to be the scouted land, place it faceup on top, and put the others on the bottom in any order",
            LINETYPE_EFFECT,
            {
                distance: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "land-biome-add",
            "{target} gains the {biome}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_LAND,
                biome: TYPE_PARAM_BIOME,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "land-biome-remove",
            "{target} loses the {biome}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_LAND,
                biome: TYPE_PARAM_BIOME,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "powerup",
            "gain {power} power",
            LINETYPE_EFFECT,
            {
                power: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "heal",
            "this creature gains {power} power, up to its base power",
            LINETYPE_EFFECT,
            {
                power: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "recovery",
            "when you use a land card to recover this creature, remove an additional {rest} rest counters from it",
            LINETYPE_EFFECT,
            {
                rest: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "stress",
            "add {rest} rest counters to {target}",
            LINETYPE_EFFECT,
            {
                rest: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            },
        ),
        new AbilityAtom(
            "negate-biomemod",
            "negate the {biomeMod} of {target}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
                biomeMod: TYPE_PARAM_BIOMEMOD,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "reveal",
            "reveal {target} from target player's hand",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "ward",
            "when an enemy creature targets this creature, they must pay Exhaust {cost}, or else their ability is interrupted",
            LINETYPE_EFFECT,
            {
                cost: TYPE_PARAM_NUMBER_WHOLE,
            }
        ),
        new AbilityAtom(
            "block-any",
            "{target} gains *Block {block}*",
            LINETYPE_EFFECT,
            {
                block: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "ward-any",
            "{target} gains *Ward {ward}*",
            LINETYPE_EFFECT,
            {
                ward: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "powerup-any",
            "{target} gains {power} power",
            LINETYPE_EFFECT,
            {
                power: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            }
        ),
        new AbilityAtom(
            "heal-any",
            "{target} gains {power} power, up to its base power",
            LINETYPE_EFFECT,
            {
                power: TYPE_PARAM_NUMBER_WHOLE,
                target: TYPE_PARAM_CREATURE,
            }
        ),
        new AbilityAtom(
            "stun",
            "interrupt target activated ability of {target}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
        ),
        new AbilityAtom(
            "suppress",
            "triggered abilities of {target} get interrupted automatically",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
        ),
        new AbilityAtom(
            "silence",
            "activated abilities of {target} get interrupted automatically",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
        ),
        new AbilityAtom(
            "fear",
            "return {target} to its owner's hand",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
        ),
        new AbilityAtom(
            "redirect",
            "change the target of target ability to {target}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "morph",
            "this creature gains or loses the {type}",
            LINETYPE_EFFECT,
            {
                type: TYPE_PARAM_TYPE,
            }
        ),
        new AbilityAtom(
            "morph-any",
            "{target} gains or loses the {type}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
                type: TYPE_PARAM_TYPE,
            },
            {
                keywordable: false,
            }
        ),
        new AbilityAtom(
            "adapt",
            "this creature gains {bonus} in the {biomeMod}",
            LINETYPE_EFFECT,
            {
                bonus: TYPE_PARAM_NUMBER_WHOLE,
                biomeMod: TYPE_PARAM_BIOMEMOD,
            }
        ),
        new AbilityAtom(
            "adapt-any",
            "{target} gains {bonus} in the {biomeMod}",
            LINETYPE_EFFECT,
            {
                target: TYPE_PARAM_CREATURE,
                bonus: TYPE_PARAM_NUMBER_WHOLE,
                biomeMod: TYPE_PARAM_BIOMEMOD,
            },
            {
                keywordable: false,
            }
        ),
    ],
]
    .flat(Infinity)
    .sort(sortFunc);
abilityAtoms
    .filter(atom => Object.entries(atom.params).length > 0)
    .forEach(atom => {
        Object.entries(atom.params).forEach(([key, value]) => {
            let tokenNames = [value].flat(Infinity);
            tokenNames.forEach(tokenName => {
                let token = abilityTokens.find(t => t.name == tokenName);
                if (!token) { return; }//it's ok, there could be non-tokens in the list
                if (token.subtokenname) {
                    atom.params[token.subtokenname] = token.subtokenname;
                }
            });
        });
    });

export function findAtom(atomName, atomType, loose = false) {
    let atom = abilityAtoms.find(a => a.name == atomName && (!atomType || a.type == atomType));
    if (atom) {
        return atom;
    }
    if (loose) {
        let split = atomName.split("-");
        atomName = split[0];
        atom = abilityAtoms.find(a => a.name == atomName && (!atomType || a.type == atomType));
        if (atom) {
            return atom;
        }
    }
    return undefined;
}
export function findToken(tokenName) {
    if (Array.isArray(tokenName)) {
        return tokenName.map(n => findToken(n)).flat(Infinity);
    }
    return abilityTokens.find(t => t.name == tokenName);
}


const strRep = [
    //remove quotes
    [/^\"(.*)\"$/g, "$1"],
    //misc
    [" self", " this"],
    [" all-team", ""],
    //plurals
    [/all-([a-z]+)/g, "all-$1s"],
    //remove dash
    [/([a-z]+)-([a-z]+)/g, "$1 $2"],
    //remove unneeded words: team
    [/(ally|enemy|neutral) team/g, "$1"],
    //reorder words: team
    [/creature(s?) *(ally|enemy|neutral)/g, "$2 creature$1"],
    //remove unneeded words: this
    [/this [a-z]* creature/g, "this creature"],
    [" from this land", ""],
    //fix weird grammar
    [/the (all|target|that)/g, "$1"],
    [/the none ([a-z]*)/g, "no $1s"],
    [/(creatures|lands) ([a-z]*)s/g, "$1 $2"],
    ["s's", "s'"],
    [/(that|target) team/g, "on $1 team"],
    //important words
    [" biomemod", " biome modifier"],
    [" ready location", " Ready pile"],
    [" returning location", " Returning pile"],
    [" resting location", " Resting pile"],
    [" deploy location", " Deploy pile"],
    //capitalize important words
    [" creature", " Creature"],
    [" land", " Land"],
];
export const stringReplacements = strRep.map(entry => new StringReplacement(entry[0], entry[1]));
