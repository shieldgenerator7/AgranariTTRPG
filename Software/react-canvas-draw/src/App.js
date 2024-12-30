import logo from './logo.png';
import './App.css';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { parsePasteFromExcel } from './Utility/Parser';
import Storage from './Utility/Storage';
import { VERSION } from './Version';
import { _normalizeForMatching, arrayRemove, isImage, isNumber } from './Utility/Utility';
import { rollDice } from './Data/DiceRoller';
import CharacterFrame from './Components/CharacterFrame';
import Character, { inflateCharacter } from './Data/Character';
import CommandPanel from './Components/CommandPanel';
import Log from './Data/Log';
import Game, { inflateGame } from './Data/Game';
import Consumable from './Data/Consumable';
import { io } from 'socket.io-client';
import RollerFrame from './Components/RollerFrame';
import ActionRollAttack, { inflateActionRollAttack } from './Data/Actions/ActionRollAttack';
import Dropzone from 'react-dropzone';
import { UploadFile } from './Utility/Upload';
import Species, { readSpeciesFromCSV } from './Data/Species';

function App() {
    //Title
    //2024-12-14: copied from https://stackoverflow.com/a/46176359/2336212
    useEffect(() => {
        document.title = `Agranari TTRPG ${VERSION}`;
    }, []);
    //URL params
    const [searchParams, setSearchParams] = useSearchParams();
    const paramCharacter = searchParams.get("character");
    const paramURL = searchParams.get("url"); //ex: http://localhost:3001
    const paramDM = searchParams.get("dm");
    //connection
    const MSG_NOT_CONNECTED = "Not connected. Use the URL parameter 'url' to connect. ex: '?url=http://yoursite.com'";
    let socket;
    let setSocket = (soc) => {
        socket = soc;
        window.socket = soc;
    }
    [socket, setSocket] = useState(() => {
        return {
            fake: true,
            on: () => console.log("on: " + MSG_NOT_CONNECTED),
            emit: () => console.log("emit: " + MSG_NOT_CONNECTED),
        };
    });
    if ((!socket || socket.fake) && paramURL){
        window.gameData = {
            players: {},
            characters: {},
        }
        console.log("connecting to server", paramURL);

        //2024-12-24: copied from https://stackoverflow.com/a/41319051/2336212
        socket = io.connect(paramURL);
        setSocket(socket);

        const devicePixelRatio = window.devicePixelRatio || 1;

        socket.on('connect', () => {
          console.log('Successfully connected!',"id", socket.id);
        });

        socket.on('updateGameData', (gameData) => {
            console.log("gameData updated", gameData);
            window.gameData = gameData;
        });

        socket.on('onDiceRolled', ({ characterName, statName, roll }) => {           
            console.log("Dice rolled!", characterName, statName, roll); 
        });

        socket.on('storage', (stor) => {
            if (stor) {
                console.log("receiving storage");
                storage.storage = stor;
                storage.saveStorage();
                storage.loadStorage();
            }
        });

        socket.on("characterSubmitted", ({ socketId, character })=> {
            // if (socketId == socket.id) { return; }

            window.gameData.characters[character.name] = character;
            if (!characterIsInGame(character.name)) {
            addCharacter(character);
            }
            else {
                setCharacterList([...characterList]);
            }
        });

        socket.on("characterUpdated", ({ socketId, character }) => {
            if (socketId == socket.id) { return; }
            let oldChar = undefined;
            for (let char of characterList) {
                if (_normalizeForMatching(char.name) == _normalizeForMatching(character.name)) {
                    oldChar = char;
                    break;
                }
            }
            if (oldChar) {
                delete window.gameData[oldChar.name];//delete for good measure in case names match but look different, ex: capitalization
                window.gameData.characters[character.name] = character;

                let index = characterList.indexOf(oldChar);
                inflateCharacter(character);
                characterList.splice(index, 1, character);
            }
            
            setCharacterList([...characterList]);
        });

        socket.on("rollerAdded", ({ socketId, roller }) => {
            if (socketId == socket.id) { return; }
            inflateActionRollAttack(roller, characterList);
            console.log("rollerAdded", socketId, roller);
            window.gameData.rollers.push(roller.title);
            addRoller(roller, false);
        });
    
        socket.on("rollerUpdated", ({ socketId, roller }) => {
            if (socketId == socket.id) { return; }
            inflateActionRollAttack(roller, characterList);
            console.log("rollerUpdated", socketId, roller);
            window.gameData.rollers[0] = roller;//TODO: make it find the right roller
            rollerList[0] = roller;
            updateRollerList(false);
        });
    
        socket.on("rollerRemoved", ({ socketId, roller }) => {
            if (socketId == socket.id) { return; }
            inflateActionRollAttack(roller, characterList);
            console.log("rollerRemoved", socketId, roller);
            window.gameData.rollers.splice(0, 1);//TODO: make it find the right roller
            removeRoller(roller, false, true);
        });

        window.socket = socket;
    }
    //Storage
    let storage;
    let setStorage = (s) => { storage = s; };
    const defaultStorage = () => new Storage();
    [storage, setStorage] = useState(defaultStorage);    
    //DM
    if (paramDM) {
        socket.emit("storage", storage.storage);
    }
    //Character
    let character = new Character("Tak Redwind", new Species("Squirrel"));
    let setCharacter = (c) => {
        character = c;
        storage.characterList = characterList;
    };
    const defaultCharacter = () => storage.characterList[0] ?? new Character("Tak Redwind", new Species("Squirrel"));
    [character, setCharacter] = useState(defaultCharacter);
    window.character = character;
    let updateCharacter = (oldcharacter) => {
        let newcharacter = JSON.parse(JSON.stringify(oldcharacter));
        if (isImage(oldcharacter.imgPortrait)) {
            newcharacter.imgPortrait = oldcharacter.imgPortrait;
        }
        inflateCharacter(
            newcharacter,
            (c) => { if (c == character) { updateCharacter(c); } }
        );
        //species
        let speciesName = character.speciesName;
        let species = speciesList.find(species => species.name == speciesName);
        character.species = species;
        //
        let charList = [...characterList];
        if (charList.includes(oldcharacter)) {
            let index = charList.indexOf(oldcharacter);
            charList.splice(index, 1, newcharacter);
        }
        setCharacterList(charList);
        //
        setCharacter(newcharacter);
        storage.characterList = characterList;

        if (!character.editAttributes) {
        socket.emit("characterUpdated", { socketId: socket.id, character: character });
        }
    };

    let renameConsumablePropagation = (oldname, newname, exceptCharacter) => {
        characterList.forEach(character => {
            if (character == exceptCharacter) {
                return;
            }
            let cr = character.consumableList.find(c => c.consumableName == oldname);
            if (cr) {
                cr.consumableName = newname;
            }
        });
        setCharacterList([...characterList]);
    };

    //Game
    let game = new Game();
    let setGame = (g) => {
        game = g;
        storage.game = game;
        window.game = game;
    };
    const defaultGame = () => storage.game ?? new Game();
    [game, setGame] = useState(defaultGame);
    window.game = game;
    let updateGame = (oldgame) => {
        let newgame = JSON.parse(JSON.stringify(oldgame));
        inflateGame(newgame);
        //

        setGame(newgame);
        game = newgame;
        storage.game = game;
        window.game = game;

    };

    //Log
    let log = new Log();
    let setLog = (l) => {
        log = l;
        storage.log = log;
    };
    const defaultLog = () => storage.log ?? new Log();
    [log, setLog] = useState(defaultLog);
    window.log = log;
    window.setLog = setLog;
    window.Log = Log;

    let updateLog = (oldlog) => {
        let newlog = JSON.parse(JSON.stringify(oldlog));
        //
        setLog(newlog);
    };
    window.updateLog = updateLog;
    window.Consumable = Consumable;

    let diceRolled = (character, rollName, rollValue, rollResult) => {
        log.recordEntryDieRoll(game, character, rollName, rollValue, rollResult);
        setLog(log);
    };
    let attributeAdjusted = (character, attributeName, oldValue, newValue) => {
        log.recordEntryAttributeAdjust(game, character, attributeName, oldValue, newValue);
        setLog(log);
    };
    let abilityModified = (character, abilityName, oldValue, newValue) => {
        //TODO: implement this
        console.warn("abilityModified not implemented yet", character, abilityName, oldValue, newValue);
    };

    // //Paste String
    // let pasteString = "";
    // let setPasteString = (s) => { pasteString = s; };
    // const defaultPasteString = () => "";
    // [pasteString, setPasteString] = useState(defaultPasteString);
    // window.pasteString = pasteString;
    // //Autodownload
    // let autoDownload = false;
    // let setAutoDownload = (b) => { autoDownload = b; };
    // const defaultAutoDownload = () => false;
    // [autoDownload, setAutoDownload] = useState(defaultAutoDownload);
    // let lastDownloadedIndex = -1;
    //Character List
    let characterList = [];
    let setCharacterList = (list) => {
        characterList = list;
        storage.characterList = characterList;
        window.characterList = characterList;
    };
    const defaultCharacterList = () => (storage.characterList.length > 0) ? storage.characterList : [character];
    [characterList, setCharacterList] = useState(defaultCharacterList);
    window.characterList = characterList;
    // //
    // if (pasteString) {
    //     let oldList = characterList;
    //     characterList = parsePasteFromExcel(pasteString);
    //     characterList.splice(0, 0, ...oldList);
    //     if (characterList.length < 1) {
    //         characterList.push(new Creature());
    //     }
    //     window.characterList = characterList;
    //     //
    //     setAutoDownload(true);
    //     autoDownload = true;
    //     for (let i = 0; i < characterList.length; i++) {
    //         setCharacter(characterList[i]);
    //     }
    //     setCharacterList([...characterList]);
    //     setAutoDownload(false);
    //     setPasteString("");
    // }
    // //Panel List
    // let panelList = [];
    // let setPanelList = (list) => { panelList = list; };
    // [panelList, setPanelList] = useState([]);
    // const openPanel = (panel, open) => {
    //     if (open) {
    //         if (!panelList.includes(panel)) {
    //             panelList.push(panel);
    //         }
    //     }
    //     else {
    //         arrayRemove(panelList, panel);
    //     }
    //     setPanelList([...panelList]);
    // };


    //Roller List
    let rollerList = [];
    let setRollerList = (list) => {
        rollerList = list;
        storage.rollerList = rollerList;
        window.rollerList = rollerList;
    };
    const defaultRollerList = () => (storage.rollerList?.length > 0) ? storage.rollerList : [];
    [rollerList, setRollerList] = useState(defaultRollerList);
    window.rollerList = rollerList;
    const updateRollerList = (send = true) => {
        if (send) {
            socket.emit("rollerUpdated", { socketId: socket.id, roller: rollerList[0] });
        }
        setRollerList([...rollerList]);
        
    }
    const addRoller = (roller, send=true) => {
        rollerList.push(roller);
        if (send) {
            socket.emit("rollerAdded", { socketId: socket.id, roller: roller });
        }
        updateRollerList();

    }
    const removeRoller = (roller, send=true, orFirst = false) => {
        let index = rollerList.indexOf(roller);
        if (index < 0 && orFirst) {
            index = 0;
        }
        rollerList.splice(index, 1);
        if (send) {
            socket.emit("rollerRemoved", { socketId: socket.id, roller: roller });
        }
        updateRollerList(false);
        
    }

    //Species List
    let speciesList = [];
    let setSpeciesList = (list) => {
        speciesList = list;
        storage.speciesList = speciesList;
        window.speciesList = speciesList;
    };
    const defaultSpeciesList = () =>  storage.speciesList ?? [];
    [speciesList, setSpeciesList] = useState(defaultSpeciesList);
    window.speciesList = speciesList;
    const updateSpeciesList = () => {
        setSpeciesList([...speciesList]);
    }
    const addSpecies = (species) => {
        speciesList.push(species);
        updateSpeciesList();
    }
    const removeSpecies = (species) => {
        let index = speciesList.indexOf(species);
        speciesList.splice(index, 1);
        updateSpeciesList();
    }

    //Character to Show
    let characterToShow = undefined;
    if (paramCharacter?.trim() || false) {
        characterToShow = characterList.find(char => char.name.trim().toLowerCase() == paramCharacter.trim().toLowerCase());
    }

    const createCharacter = (species)=>{
        let index = characterList.length;
        let character = new Character(`${species.name}${index + 1}`, species);
        addCharacter(character);
    }

    const addCharacter = (character) => {
        inflateCharacter(character);
        if (!characterList.some(char => _normalizeForMatching(char.name) == _normalizeForMatching(character.name))) {
        characterList.push(character);
    
        // gameData.players[socket.id].characterList.push(character);

        setCharacterList([...characterList]);
        }
    }

    const characterIsInGame = (character) => {
        if (!window.gameData?.characters) {
            console.log("cant search", window.gameData?.characters);
            return false;
        }
        // return Object.entries(window.gameData.players)
        //     .map(([k, v]) => v)
        //     .some(([k, v]) =>
        //         v.characterList
        //             .some(char => char.name == character.name)
        //     ) ?? false;
        for (let [k, v] of Object.entries(window.gameData.characters)) {
            console.log("searching", k, v);
            if (!v) {
                console.log("error not found", k, v);
                continue;
            }
            if (_normalizeForMatching(v.name) == _normalizeForMatching(character.name)) {
                return true;
            }
        }
        return false;
    }
    window.characterIsInGame = characterIsInGame;

    return (
        <div className="App">
            <header className="App-header">
                <div className='characterZone'>
                    {!characterToShow && rollerList.length>0 &&
                    <div className='rollerZone'>
                    {
                        rollerList.map((roller,i) =>
                    <RollerFrame
                        actionRoller={roller}
                        updateRoller={updateRollerList}
                        key={`roller_${i}`}
                        removeRoller={removeRoller}
                    ></RollerFrame>
                        )
                    }
                    </div>
                    }
                    {characterToShow &&
                        <CharacterFrame
                            character={characterToShow}
                            updateCharacter={(c) => updateCharacter(c)}
                            game={game}
                            updateGame={updateGame}
                            socket={socket}
                            characterIsInGame={characterIsInGame(characterToShow)}
                            diceRolled={diceRolled}
                            attributeAdjusted={attributeAdjusted}
                            abilityModified={abilityModified}
                            characterList={characterList}
                            setCharacterList={setCharacterList}
                            renameConsumable={renameConsumablePropagation}
                            addRoller={addRoller}
                            key={`character_`}
                        ></CharacterFrame>
                    }
                    {!characterToShow &&
                        characterList.map((char, i) => (
                            <CharacterFrame
                                character={char}
                                updateCharacter={(c) => updateCharacter(c)}
                                game={game}
                                updateGame={updateGame}
                                socket={socket}
                                characterIsInGame={characterIsInGame(char)}
                                diceRolled={diceRolled}
                                attributeAdjusted={attributeAdjusted}
                                abilityModified={abilityModified}
                                characterList={characterList}
                                setCharacterList={setCharacterList}
                                renameConsumable={renameConsumablePropagation}
                                addRoller={addRoller}
                                key={`character_${i}`}
                            ></CharacterFrame>
                        ))
                    }
                    {
                        !characterToShow &&
                        <div className='characterFrame'>
                                Character Menu
                                {/* Drop Zone */}
                                <Dropzone
                                    onDrop={
                                        files => files.forEach(file =>
                                            UploadFile(
                                                file,
                                                true,
                                                (content, filename) => {
                                                    // let obj = JSON.parse(decodeURIComponent(content));
                                                    if (filename.endsWith(".csv")) {
                                                        let species = readSpeciesFromCSV("Wolf", content);
                                                        console.log("species", species);
                                                        let statCosts = species.randomStatCosts();
                                                        console.log("random stat costs", statCosts);
                                                        addSpecies(species);
                                                    }
                                                    else {
                                                        console.log("file dropped:", filename)
                                                        console.log(content);
                                                    }
                                                }
                                            ))
                                    }
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps({ className: "dropzone" })}>
                                            <input {...getInputProps()} />
                                            <p>drop .CSV files here</p>
                                        </div>
                                    )}
                                </Dropzone>
                                <div>
                                    Make new character of species:
                                    <ul>
                                        {
                                            speciesList.map((species,i) => (
                                                <li key={i}>
                                                    <button
                                                        onClick={() => {
                                                            createCharacter(species);
                                                        }}
                                                    >
                                                        {species.name}
                                                    </button>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                        </div>
                    }
                </div>
                {!characterToShow &&
                    <CommandPanel
                        game={game}
                        updateGame={updateGame}
                        characterList={characterList}
                        setCharacterList={setCharacterList}
                        log={log}
                    ></CommandPanel>
                }
            </header>
        </div>
    );
}

export default App;
