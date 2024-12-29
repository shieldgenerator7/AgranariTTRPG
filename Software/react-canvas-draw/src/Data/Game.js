"use strict";

import { inflateConsumable } from "./Consumable";

class Game {
    constructor() {
        this.characterList = [];
        this.consumableList = [];
        this.log = undefined;
        this.event = "";
        this.location = "";
    }

    getConsumable(consumableName) {
        return this.consumableList.find(c => c.name == consumableName);
    }
}
export default Game;

export function inflateGame(game) {
    Object.setPrototypeOf(game, Game.prototype);

    game.consumableList = game.consumableList.filter(a => a);
    game.consumableList.forEach(consumable => {
        inflateConsumable(consumable);
    });
}

export function backwardsCompatifyGame(game) {
    game.consumableList ??= [];
}
