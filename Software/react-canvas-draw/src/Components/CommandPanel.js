"use strict";

import Character, { inflateCharacter } from "../Data/Character";
import Field from "./Field";
import LogPanel from "./LogPanel";
import React from "react";

function CommandPanel({ game, updateGame, characterList, setCharacterList, log }) {

    let logList = log.entryList;
    let filter = game.event;
    if (filter) {
        let filterList = filter.trim().toLowerCase().split(" ").map(f => f.trim()).filter(f => f);
        logList = logList.filter(entry => filterList.every(f => entry.includes(f)));
    }
    logList = logList.slice(-100);

    return (
        <div className="commandPanel">
            <div className="commandControls">
                <Field
                    name="Event"
                    value={game.event}
                    setValue={(v) => {
                        game.event = v;
                        updateGame(game);
                    }}
                    className="editText"
                    placeHolder="Event"
                ></Field>
                <button
                    onClick={(e) => {
                        let character = new Character("New Character");
                        characterList.push(character);
                        setCharacterList(characterList);
                    }}
                >
                    New Character
                </button>
                <button
                    onClick={(e) => {
                        navigator.clipboard.readText().then(v => {
                            let clipboardText = v || "{}";
                            try {
                                let obj = JSON.parse(clipboardText);
                                if (obj.attributeList) {//TODO: make better json obj type detection
                                    let character = obj;
                                    inflateCharacter(character);
                                    character.name += " (Copy)";
                                    characterList.push(character);
                                    setCharacterList([...characterList]);
                                }
                            }
                            catch (SyntaxError) {

                            }
                        });
                    }}
                >
                    Paste Character
                </button>
                <div className="logReport">
                    Log Entries:
                    <div className="logReportInfo">
                        {(logList.length != log.entryList.length) ? `${logList.length}/` : ""}{log.entryList.length}
                    </div>
                </div>
            </div>
            <LogPanel
                log={log}
                game={game}
                logList={logList}
            ></LogPanel>
        </div>
    );
}
export default CommandPanel;