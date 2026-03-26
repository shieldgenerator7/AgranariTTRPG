"use strict";

import { DIE_ROLL_FLAIR_NORMAL } from "./Constants";

class Roll {
    constructor(name, value, flair = DIE_ROLL_FLAIR_NORMAL) {
        this.name = name;
        this.value = value;
        this.flair = flair;
    }
}
export default Roll;
