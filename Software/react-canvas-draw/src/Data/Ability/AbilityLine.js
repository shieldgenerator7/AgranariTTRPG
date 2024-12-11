"use strict";

import { ensureQuotes, isString } from "../../Utility/Utility";
import { LINETYPE_COST, LINETYPE_EFFECT, LINETYPE_REQUIREMENT, LINETYPE_TRIGGER } from "./AbilityConstants";
import { abilityAtoms, abilityTokens } from "./AbilityData";


/**
 * A single line of code of an ability
 * Multiple AbilityLines come together to form an ability
 */
class AbilityLine {
    constructor(line) {

        //ex: > attack: 3, target, any
        this.line = line.trim().toLowerCase();
        let tokens = line.split(" ").map(t => t.trim()).filter(t => t);

        //determine type of line
        this.type = "";
        let firstChar = tokens[0];
        switch (firstChar) {
            case "$": this.type = LINETYPE_COST; break;
            case "!": this.type = LINETYPE_TRIGGER; break;
            case "?": this.type = LINETYPE_REQUIREMENT; break;
            case ">": this.type = LINETYPE_EFFECT; break;
        }

        //determine which atom
        this.atomName = tokens[1]?.match(/[a-zA-Z\-]+/)?.[0] ?? "choose";
        if (this.atomName == "choose") {
            this.atom = abilityAtoms.find(atom => atom.name == this.atomName);
        }
        else {
            this.atom = abilityAtoms.find(atom => atom.name == this.atomName && atom.type == this.type);
        }
        if (!this.atom) {
            console.error("unable to find atom!", this.atomName, this.atom, this.type);
            return this;
        }

        //load in params
        this.params = tokens.slice(2)
            .map(token => {
                let testToken = token.match(/(\".+\")|(.+\")|(\".+)/)?.[0] ?? "";
                let newtoken = token
                    ?.match(/[a-zA-Z0-9\"\-]+/)?.[0]
                    ?.trim();
                if (testToken.endsWith("\"") && !newtoken.endsWith("\"")) {
                    newtoken += "\"";
                }
                return newtoken;
            })
            .filter(token => token);
        //check for quotes
        let startIndex = undefined;
        let validStartIndex = () => startIndex >= 0;
        for (let i = 0; i < this.params.length; i++) {
            let param = this.params[i];
            if (!validStartIndex() && param.startsWith("\"") && param.endsWith("\"")) {
                this.params[i] = param.match(/[a-zA-Z0-9 \-]+/)?.[0] ?? "";
                continue;
            }
            if (!validStartIndex() && param.startsWith("\"")) {
                startIndex = i;
            }
            if (validStartIndex() && param.endsWith("\"")) {
                if (startIndex != i) {
                    //combine the elements
                    let string = this.params
                        .splice(startIndex, (i - startIndex) + 1)
                        // .map(str => str.match(/[a-zA-Z0-9"]+/)[0])
                        .join(" ");
                    this.params.splice(startIndex, 0, string.match(/[a-zA-Z0-9 \-]+/)[0]);
                }
                startIndex = undefined;
            }
        }

    }

    getString() {
        let symbol = "";
        switch (this.type) {
            case LINETYPE_COST: symbol = "$"; break;
            case LINETYPE_TRIGGER: symbol = "!"; break;
            case LINETYPE_REQUIREMENT: symbol = "?"; break;
            case LINETYPE_EFFECT: symbol = ">"; break;
        }
        let paramTexts = this.params.map(param => {
            //put string in quotes
            if (isString(param) && param.includes(" ")) {
                return ensureQuotes(param);
            }
            return param;
        });
        return `${symbol} ${this.atomName}${(paramTexts?.length > 0) ? `: ${paramTexts.join(", ")}` : ""} `;
    }

    setAtom(name) {
        this.atomName = name;
        this.atom = abilityAtoms.find(atom => atom.name == this.atomName && atom.type == this.type)
            ?? abilityAtoms.find(atom => atom.name == this.atomName);
        if (!this.atom) {
            console.error("unable to find atom!", this.atomName, this.atom);
            return;
        }
        this.type = this.atom.type;
        //params
        this.params = Object.entries(this.atom.params).map(([key, value], i) => {
            let tokenNames = [value].flat(Infinity);
            return tokenNames.map(tokenName => {
                let token = abilityTokens.find(t => t.name == tokenName);
                if (!token) { return tokenName; }//it's ok, there could be non-tokens in the list
                return token.defaultOption;
            })[0];
        });
        //
        console.log("setAtom", this.atomName, this.type, this.atom);
    }
}
export default AbilityLine;
