"use strict";

/**
 * A line that describes ability behaviour
 * Ex: Cost, Trigger, Requirement, Effect
 */
class AbilityAtom {
    constructor(name, text, type, params, settings) {
        this.name = name;
        this.text = text;
        this.type = type;
        this.params = params;
        this.settings = settings ?? {};
        this.settings.keywordable ??= true;
    }

    get paramValues() {
        return Object.values(this.params);
    }
}
export default AbilityAtom;
