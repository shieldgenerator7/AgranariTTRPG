"use strict";

class UndoState{
    constructor(obj, stringify) {
        this.json = JSON.stringify(obj, stringify);
    }
}
