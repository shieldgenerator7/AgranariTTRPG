


/**
 * Each action has a list of instructions that tell the characters what to do,
 * this gets processed as the timeline progresses into events
 */
class Instruction{
    constructor() {
        this.characterName = "";
        this.instruction = {
            a:"wait",
        }
    }
}

let character = {
    name: "Mudrich",
    abilityList: [
        {
            name: "Attack",
            range: 0.5,//in meters
        },
    ],
    instructionList: [
        // {
        //     instruction: "moveToTarget",
        //     target: "Tigrin",
        //     speed: "run",
        // },
        {
            instruction: "attackTarget",
            target: "Tigrin",
            conditions: {
                range: 0.5,
            },
            action: "if {Accuracy} > target.{Dodge}: damage target {Damage}.",
            action: "check Accuracy vs target.Dodge, decrease target.HP by Damage",
        },
    ],
};