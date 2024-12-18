"use strict";

import { backwardsCompatifyCharacter, inflateCharacter } from "../Data/Character";
import Consumable from "../Data/Consumable";
import Game, { backwardsCompatifyGame, inflateGame } from "../Data/Game";
import Log from "../Data/Log";
import LogEntry from "../Data/LogEntry";
import { inflateSpecies } from "../Data/Species";
import { arrayRemoveDuplicatesQuery } from "./Utility";

//2024-03-08: copied from StoryViewer

const storageName = "AgranariTTRPG_SaveGame";

class Storage {
    constructor() {
        this.storageName = "AgranariTTRPG_SaveGame";
        this.storage = {
            //list of all characters
            characterList: [],//TODO: just store the game
            //game
            game: new Game(),
            //log
            log: new Log(),
            //species
            speciesList: [],
        };
        this.entryCount = 0;
        this.loadStorage();
        this.saveStorage();
        let storage = this;
        let _saveStorage = this.saveStorage.bind(this);
        window.onbeforeunload = _saveStorage;
        window.onblur = _saveStorage;
        //TEST
        window.storage = this;
    }

    saveStorage() {
        let stringify = JSON.stringify(this.storage);
        localStorage.setItem(this.storageName, stringify);
    }

    loadStorage() {
        let content = localStorage.getItem(this.storageName);
        if (content == 'undefined') {
            content = null;
        }
        if (!content?.trim()) {
            content = null;
        }
        this.storage = JSON.parse(content) ?? this.storage;
        //
        this.backwardsCompatifyStorage(this.storage);
        //
        this.storage.characterList.forEach(character => {
            inflateCharacter(character);
            backwardsCompatifyCharacter(character);
        });
        //
        inflateGame(this.storage.game);
        backwardsCompatifyGame(this.storage.game);
        //
        //populate game consumables if its missing some
        this.storage.characterList.forEach(character => {
            character.consumableList.forEach(consumableRef => {
                if (!this.storage.game.getConsumable(consumableRef.consumableName)) {
                    this.storage.game.consumableList.push(new Consumable(consumableRef.consumableName));
                }
            });
        });
        //remove extra consumables
        this.game.consumableList = arrayRemoveDuplicatesQuery(
            this.game.consumableList,
            (m, n) => m.name == n.name
        );
        //
        Object.setPrototypeOf(this.storage.log, Log.prototype);
        this.storage.log.entryList.forEach(entry => {
            Object.setPrototypeOf(entry, LogEntry.prototype);
            entry._dateTime = new Date(entry.dateTime);
        });
        //Species        
        this.storage.speciesList.forEach(species => {
            inflateSpecies(species);
            // backwardsCompatifyCharacter(character);
        });
        //hook up species into character
        this.characterList.forEach(character => {
            let speciesName = character.speciesName;
            let species = this.speciesList.find(species => species.name == speciesName);
            character.species = species;
        })
        // Object
    }

    backwardsCompatifyStorage(storage) {
        //Change: add deckList
        if (!storage.deckList) {
            storage.deckList = [];
        }
    }

    get game() {
        return this.storage.game;
    }
    set game(value) {
        this.storage.game = value;
    }

    get characterList() {
        return this.storage.characterList;
    }
    set characterList(value) {
        this.storage.characterList = value;
    }    

    get speciesList() {
        return this.storage.speciesList;
    }
    set speciesList(value) {
        this.storage.speciesList = value;
    }

    get log() {
        return this.storage.log;
    }
    set log(value) {
        this.storage.log = value;
    }

    get game() {
        return this.storage.game;
    }
    set game(value) {
        this.storage.game = value;
    }
}
export default Storage;
