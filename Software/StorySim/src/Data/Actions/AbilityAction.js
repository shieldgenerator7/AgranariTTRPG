

/**
 * An action taken as part of an ability
 */
class AbilityAction extends AbilityAtom{
    constructor() {
        this.action = ACTION_ROLL_MODIFY;

        //effect
        this.attribute = "";//ex: "accuracy"
        this.baseValueBonus = 0;//ex: 5, -8
        this.dieRollBonus = 0;
    }

    process(){
        //do nothing
        return true;
    }
}