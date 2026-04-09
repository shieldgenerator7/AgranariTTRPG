


/**
 * An action is something a character can do
 */
class Action{
    constructor() {
        // /** Info to give the ability at the time of activating */
        // this.paramList = [
        //     // "target",//character or object to act on
        //     // "speed",//how fast to move
        //     // "direction",
        //     // "position",
        //     // "timestamp",
        // ];
        // /** things that must be true for the action to start, else the character will do what they can to meet these conditions first */
        // this.conditions = {
        //     range: null,//if set, the target must be within range
        //     hold: null,//can set to require a certain tool or weapon
        // }
        this.windup = 0;//time between ability activating and actually doing the thing
        this.endlag = 0;//time between ability finishing and the character being free to do something else
        this.limbs = ["righthand", "lefthand"];//which limbs this action uses. used to determine which actions can happen simultaneously

    }
}

let actionList = [
    {
        name: "Attack",
        paramList: ["target"],
        range: 0.5,
        windup: 200,
        endlag: 250,
        limbList: ["righthand", "lefthand"],
        // successDC: 10,
        // rollList: ["Accuracy", "Damage"],
        // processFunc: (rollResults, target) => {
        //     if (rollResults[0] >= this.successDC) {
        //         target.health += -1 * rollResults[1];
        //     }
        // },
        check: "Accuracy",
        successDC: "10 + target.Dodge",
        changeVar: "target.Health",
        changeAmount: "-Damage",
    },
    {
        //new actions can be based on existing actions, and replace only values that change
        name: "Claw Attack",
        parent: "Attack",
        range: 0.6,
        windup: 150,
        limbList: ["hand"],
        rollList: ["ClawAccuracy", "ClawDamage"],
    },
    {
        name: "Heal",
        paramList: ["target"],
        range: 1,
        windup: 2000,
        limbList: ["righthand", "lefthand"],
        successDC: 10,
        check: "Healing",
        successDC: 12,
        changeVar: "target.Health",
        changeAmount: "HealPower",
    },
];