"use strict";

import { clamp } from "../Utility/Utility";
import { LIMIT_POSITIVE_ONLY, ONCLICK_ADJUST_VALUE, ONCLICK_DIE_ROLL, ONCLICK_TOGGLE, REGEX_SPACER_TEST } from "./Constants";

class Attribute {
    constructor(name, value = 0, max = 0, dieRoll = "1d20") {
        this.name = name;
        this.displayName = "";
        this.value = value;
        this.max = max;
        this.onclick = ONCLICK_ADJUST_VALUE;
        this.limit = LIMIT_POSITIVE_ONLY;
        this.dieRoll = dieRoll;//"d20", "2d8"
        this.visible = true;
    }

    get Value() {
        return this.value;
    }
    set Value(value) {
        if (this.max > 0) {
            this.value = clamp(value, 0, this.max);
        }
        else {
            this.value = value;
        }
    }

    get OnClickType() {
        if (this.max > 0) {
            return ONCLICK_ADJUST_VALUE;
        }
        if (this.dieRoll) {
            return ONCLICK_DIE_ROLL;
        }
        return ONCLICK_ADJUST_VALUE;
    }

    getDisplayText() {
        const name = this.displayName || this.name;
        const value = (this.value || 0) * 1;
        //type: limited resource
        switch (this.OnClickType) {
            case ONCLICK_ADJUST_VALUE:
                if (this.max > 0) {
                    return `${name}: ${value}/${this.max}`;
                }
                else {
                    return `${name}: ${value}`;
                }
                break;
            case ONCLICK_DIE_ROLL:
                let valueModStr = ((value > 0) ? "+" : "") + value;
                if (this.dieRoll == "1d20" || this.dieRoll == "d20") {
                    return `${name}: ${valueModStr}`;
                }
                if (value != 0) {
                    return `${name}: ${this.dieRoll} ${valueModStr}`;
                }
                else {
                    return `${name}: ${this.dieRoll}`;
                }
                break;
            default:
                return `${name}`;
        }
    }

    get IsSpacer() {
        return REGEX_SPACER_TEST.test(this.name);
    }
}
export default Attribute;

export function inflateAttribute(attribute) {
    Object.setPrototypeOf(attribute, Attribute.prototype);
}
