"use strict";

import { arraySum } from "../Utility/Utility";
import CostSpec from "./CostSpec";
import { backwardsCompatifyCreature, inflateCreature } from "./Creature";

class Deck {
    constructor() {
        this._cardList = [];
        // this.costSpec = new CostSpec();
    }

    addCard(card, count = 1) {
        this._cardList.push({
            card: card,
            count: count,
        });
    }

    get TotalCost() {
        return arraySum(
            this._cardList,
            obj => this.costSpec.getTotalCost(obj.card) * obj.count
        );
    }
}

export default Deck;

export function inflateDeck(deck) {
    Object.setPrototypeOf(deck, Deck.prototype);

    deck._cardList.forEach(card => inflateCreature(card));
}

export function backwardsCompatifyDeck(deck) {

    deck._cardList.forEach(card => backwardsCompatifyCreature(card));
}
