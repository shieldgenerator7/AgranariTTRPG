"use strict";

class StringReplacement{
    constructor(regex, value) {
        this.regex = regex;
        this.value = value;
    }

    processString(str) {
        return str.replaceAll(this.regex, this.value);
    }
}
export default StringReplacement;
