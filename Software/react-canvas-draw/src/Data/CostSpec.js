"use strict";

import { arraySum, isNumber } from "../Utility/Utility";
import AbilityCost from "./Ability/AbilityCost";
import { LINETYPE_EFFECT, TYPE_PARAM_TEAM } from "./Ability/AbilityConstants";
import { abilityAtoms } from "./Ability/AbilityData";
import Table from "./Table";

/**
 * Stores data needed to calculate the point cost of a card
 */
class CostSpec {
    constructor() {

        this.basePowerFunc = (v) => v * 2;
        this.biomeModifierFunc = (v) => v / 2;

        this.biomeModifierAllFunc = (bmList, basePower) => Math.max(
            basePower * 5 * this.biomeModifierFunc(-1),
            arraySum(
                bmList,
                bm => this.biomeModifierFunc(bm.modifier)
            )
        );

        this.costDict = defaultCostDict();

        this.restFunc = (v) => {
            if (v <= 0) { return 0; }
            const restSqr = Math.pow(v, 2);
            return -(Math.min(restSqr, v * 5) + Math.max(1, restSqr * 0.1));
        };

        this.abilityPointCostFactor = 3;

        this.abilityFunc = (a) => {
            let cost = 0;
            for (let i = a.lines.length - 1; i >= 0; i--) {
                let line = a.lines[i];
                let atom = line.atom;
                if (!atom) {
                    console.error("cant find atom", line.atomName, atom);
                    continue;
                }
                let lineCost = 0;
                if (atom.type == LINETYPE_EFFECT) {
                    lineCost = this.getCost(atom.name, line.params) * this.abilityPointCostFactor;
                }
                else {
                    let discount = this.getDiscount(atom.name, cost, line.params);
                    if (cost > 0 && !(discount > 0)) {
                        console.error("invalid discount", discount, a.name);
                    }
                    lineCost = -discount;
                }
                line.cachedCost = lineCost;
                cost += lineCost;
            }
            return Math.max(0, cost);
        };

        this.abilityAllFunc = (aList) => arraySum(
            aList,
            a => Math.max(0, this.abilityFunc(a))
        );

        this.discountFunc = (c) => c / 10;

        this.totalCost = (card) => {
            let cost = 0;

            //Base Power
            cost += Math.max(0, this.basePowerFunc(card.basePower));

            //Biome Modifiers
            cost += this.biomeModifierAllFunc(card.biomeModifiers, card.basePower);

            //Abilities
            cost += this.abilityAllFunc(card.abilities);

            //Rest
            cost += this.restFunc(card.rest);

            //Discount
            cost += -this.discountFunc(cost);

            //Finalize
            cost = Math.round(cost);
            cost = Math.max(cost, card.basePower);

            //
            return cost;
        };
    }

    getTotalCost(card) {
        let cost = this.totalCost(card);
        if (!cost) {
            console.error("Invalid cost on card!", card?.getNameText(), cost);
            return 1;
        }
        return cost;
    }
    getStarCount(card) {
        let total = this.getTotalCost(card);
        return Math.ceil(Math.sqrt(total * 0.75));
    }

    getCost(name, ...params) {
        let ac = this.costDict[name];
        if (!ac) {
            console.error("unknown cost ability cost!", name);
            return 0;
        }
        let cost = ac.getCost(params);
        if (!isNumber(cost)) {
            console.error("invalid cost on ability cost!", name, cost);
            return 0;
        }
        return cost;
    }
    getDiscount(name, cost, ...params) {
        let ac = this.costDict[name];
        if (!ac) {
            console.error("unknown discount ability cost!", name);
            return 0;
        }
        let discount = ac.getDiscount(cost, params);
        if (!isNumber(discount)) {
            console.error("invalid discount on ability cost!", name, discount, params);
            return 0;
        }
        return discount;
    }
}
export default CostSpec;
export const costSpec = new CostSpec();

function defaultCostDict() {
    const attackTable = new Table(
        [
            "all-teams",
            "ally",
            "enemy",
            "neutral",
            "target-team",
            "that-team",
        ],
        [
            "target",
            "all",
            "self",
            "nonself",
            "triggering",
            "that",
        ],
        [
            [1, 1, -1, 1.5, 1, 1],
            [-1, -3, -1, -2, -1, -1],
            [1, 3, undefined, 3, 1, 1],
            [1, 1, -1, 1, 1, 1],
            [1, 3, -1, 3, 1, 1],
            [1, 3, -1, 3, 1, 1],
        ]
    );

    let costDict = {

        // custom / choose
        "choose": new AbilityCost(
            (args, table, cost) => 0
        ),
        "custom-cost": new AbilityCost(
            (args, table, cost) => (args.discount * 1) + cost * args.discountFactor / 100
        ),
        "custom-trigger": new AbilityCost(
            (args, table, cost) => (args.discount * 1) + cost * args.discountFactor / 100
        ),
        "custom-requirement": new AbilityCost(
            (args, table, cost) => (args.discount * 1) + cost * args.discountFactor / 100
        ),
        "custom-effect": new AbilityCost(
            (args, table, cost) => args.cost
        ),

        //costs
        "exhaust": new AbilityCost(
            (args, table, cost) => cost * (1 - (1 / (args.cost + 1)))
        ),
        "rest": new AbilityCost(
            (args, table, cost) => cost * (1 - (1 / (args.rest + 1)))
        ),
        "discard": new AbilityCost(
            (args, table, cost) => cost * (1 - (1 / (args.count + 1)))
        ),
        "sacrifice": new AbilityCost(
            (args, table, cost) => cost * (1 - (1 / (args.count + 1)))
        ),
        "tap": new AbilityCost(
            (args, table, cost) => cost * (1 - (1 / (args.tap + 1)))
        ),

        //triggers
        "ambush": new AbilityCost(
            (args, table, cost) => cost * 0.8
        ),
        "greeting": new AbilityCost(
            (args, table, cost) => cost * 0.8
        ),
        "battlecry": new AbilityCost(
            (args, table, cost) => cost * 0.9
        ),
        "revenge": new AbilityCost(
            (args, table, cost) => cost * 0.95
        ),
        "avenge": new AbilityCost(
            (args, table, cost) => cost * 0.9
        ),
        "targeted-by-ally": new AbilityCost(
            (args, table, cost) => cost * 0.5
        ),
        "targeted-by-enemy": new AbilityCost(
            (args, table, cost) => cost * 0.5
        ),
        "intercept": new AbilityCost(
            (args, table, cost) => cost * 0.5
        ),
        "retaliate": new AbilityCost(
            (args, table, cost) => cost * 0.5
        ),
        "other-takes-damage": new AbilityCost(
            (args, table, cost) => cost * 0.3
        ),
        "dawn": new AbilityCost(
            (args, table, cost) => cost * 0.95
        ),
        "dusk": new AbilityCost(
            (args, table, cost) => cost * 0.95
        ),

        //requirements
        "home": new AbilityCost(
            (args, table, cost) => cost * 0.75
        ),
        "once": new AbilityCost(
            (args, table, cost) => cost * 0.7
        ),
        "channel": new AbilityCost(
            (args, table, cost) => cost * 0.7
        ),
        "social": new AbilityCost(
            (args, table, cost) => (args.count - 1) * 0.7
        ),
        "symbiotic": new AbilityCost(
            (args, table, cost) => cost * (0.5 + 0.45 * Math.min(args.count, 5) / 5)
        ),
        "slow": new AbilityCost(
            (args, table, cost) => cost * 0.5
        ),
        "powerful": new AbilityCost(
            (args, table, cost) => cost * (0.25 + ((args.power - 1) * 0.05))
        ),

        //effects
        "attack": new AbilityCost(
            (args, table) => {
                let damage = args.damage;
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return damage * targetMx;
            },
            attackTable
        ),
        "block": new AbilityCost(
            (args) => args.block
        ),
        "move": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return 10 * targetMx;
            },
            attackTable
        ),
        "scout": new AbilityCost(
            (args) => Math.max(1, args.distance - 1) * 2
        ),
        "land-biome-add": new AbilityCost(
            (args, table) => {
                let target = args.target;
                let biome = args.biome;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(biome, target) ?? 1;
                return 10 * targetMx;
            },
            new Table(
                [
                    "target",
                    "all",
                    "none",
                    "that",
                    "specific",
                    "scouted",
                ],
                [
                    "target",
                    "all",
                    "this",
                    "that",
                    "scouted",
                ],
                [
                    [1, 3, 1, 1, undefined],
                    [3, 5, 2, 3, undefined],
                    [0, 0, 0, 0, undefined],
                    [1, 3, 1, 1, undefined],
                    [2, 5, 2, 2, undefined],
                    [0.5, 1.5, 0.5, 0.5, undefined],
                ]
            )
        ),
        "land-biome-remove": new AbilityCost(
            (args, table) => {
                let target = args.target;
                let biome = args.biome;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(biome, target) ?? 1;
                return 10 * targetMx;
            },
            new Table(
                [
                    "target",
                    "all",
                    "none",
                    "that",
                    "specific",
                    "scouted",
                ],
                [
                    "target",
                    "all",
                    "this",
                    "that",
                    "scouted",
                ],
                [
                    [1, 3, 1, 1, undefined],
                    [1, 3, 1, 1, undefined],
                    [0, 0, 0, 0, undefined],
                    [1, 3, 1, 1, undefined],
                    [2, 5, 2, 2, undefined],
                    [0.5, 1.5, 0.5, 0.5, undefined],
                ]
            )
        ),
        "powerup": new AbilityCost(
            (args) => args.power
        ),
        "recovery": new AbilityCost(
            (args) => args.rest - 1
        ),
        "stress": new AbilityCost(
            (args) => args.rest - 1
        ),
        "negate-biomemod": new AbilityCost(
            (args) => 10
        ),
        "reveal": new AbilityCost(
            (args) => 5
        ),
        "ward": new AbilityCost(
            (args) => args.cost * 1.5
        ),
        "block-any": new AbilityCost(
            (args) => args.block
        ),
        "ward-any": new AbilityCost(
            (args) => args.ward * 1.5
        ),
        "powerup-any": new AbilityCost(
            (args) => args.power * 3
        ),
        "heal-any": new AbilityCost(
            (args) => args.power * 1
        ),
        "stun": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return 1 * targetMx;
            },
            attackTable
        ),
        "suppress": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return 2 * targetMx;
            },
            attackTable
        ),
        "silence": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return 2 * targetMx;
            },
            attackTable
        ),
        "fear": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return args.power * targetMx;
            },
            attackTable
        ),
        "redirect": new AbilityCost(
            (args, table) => {
                let team = args[TYPE_PARAM_TEAM];
                let target = args.target;
                //calc per 1 use
                //assume 3v3
                let targetMx = table.get(team, target) ?? 1;
                return args.power * targetMx;
            },
            attackTable
        ),
    };
    Object.entries(costDict).forEach(([key, value]) => {
        let atom = abilityAtoms.find(a => a.name == key);
        value.init(atom);
    });
    return costDict;
}

export function costDisplay(value, allowNegative = false, allowPositive = true, includeSign = true) {
    value = Math.ceil(value);
    if (!allowNegative) {
        value = Math.max(0, value);
    }
    if (!allowPositive) {
        value = Math.min(0, value);
    }
    value ||= 0;//NaN prevention
    let plural = value != 1;
    return `(${(value > 0 && includeSign) ? "+" : ""}${value}${(plural) ? "pts" : "pt"})`;
}
