"use strict";

import { abilityAtoms, abilityTokens } from "../Data/Ability/AbilityData";
import SearchSelect from "./SearchSelect";
import { LINETYPE_EFFECT, TYPE_PARAM_NUMBER_FRACTION, TYPE_PARAM_NUMBER_WHOLE, TYPE_PARAM_STRING } from "../Data/Ability/AbilityConstants";
import Counter from "./Counter";
import { DISPLAY_LINE_KEYWORD_ONLY, DISPLAY_LINE_FULL, DISPLAY_LINE_KEYWORD_WITH_REMINDER } from "../Data/Ability/Ability";
import AbilityLine from "../Data/Ability/AbilityLine";
import { costDisplay, costSpec } from "../Data/CostSpec";
import { capitalizeFirstLetters } from "../Utility/Utility";
import AbilityAtomOption from "./AbilityAtomOption";
import { Markup } from 'interweave';

function AbilityPanel({ ability, updateAbility }) {
    return ability && (<div className="abilityArea">
        {/* Ability Name */}
        {ability.name || "Ability Name"} {costDisplay(costSpec.abilityFunc(ability))}

        {/* Remove Button */}
        <button className="ex" onClick={() => {
            updateAbility(undefined);
        }}>X</button>

        {/* Name Input */}
        <input type="text" className="field" onChange={(e) => {
            ability.name = e.target.value;
            updateAbility(ability);
        }}
            value={ability.name}
        >
        </input>

        {/* Ability Lines */}
        {ability.lines.map((line, i) => {
            let j;//used to get around weird react limitations
            return (<div className="abilityLineArea" key={`_ability_line_${i}`}>
                <div className="abilityAtomName">
                    <span>
                        {line.atomName == "choose" &&
                            <SearchSelect
                                option={line.atomName}
                                options={abilityAtoms.map(a => a.name)}
                                setOption={(o) => {
                                    line.setAtom(o);
                                    ability.updateDNA();
                                    updateAbility(ability);
                                }}
                            ></SearchSelect>
                        }
                        {line.atomName != "choose" && (<span>{capitalizeFirstLetters(line.atomName, true)} </span>)}
                        {/* Line Point Cost */}
                        {costDisplay(line.cachedCost, line.type != LINETYPE_EFFECT, line.type == LINETYPE_EFFECT)}
                    </span>

                    <span>
                        {/* Move Down Button */}
                        <button className="ex" onClick={() => {
                            ability.moveLine(i, i + 1);
                            updateAbility(ability);
                        }}>\/</button>
                        {/* Move Up Button */}
                        <button className="ex" onClick={() => {
                            ability.moveLine(i, i - 1);
                            updateAbility(ability);
                        }}>/\</button>

                        {/* Remove Button */}
                        <button className="ex" onClick={() => {
                            ability.removeLine(i);
                            updateAbility(ability);
                        }}>X</button>
                    </span>
                </div>
                <div className="abilityAtomLine">
                    {
                        Object.entries(line.atom?.params ?? {}).map(([key, value], j) => {
                            let keyLabel = `${key?.replaceAll("_", "")}`;
                            let option;
                            let optionList;
                            if (value == TYPE_PARAM_NUMBER_WHOLE) {
                                option = line.params[j] ?? 0;
                            }
                            else if (value == TYPE_PARAM_NUMBER_FRACTION) {
                                option = line.params[j] ?? 0.1;
                            }
                            else if (value == TYPE_PARAM_STRING) {
                                option = line.params[j] ?? "";
                            }
                            else {
                                optionList = [value]
                                    .flat(Infinity)
                                    .map(v => abilityTokens.find(token => token.name == v)?.options ?? v)
                                    .flat(Infinity)
                                    .filter(o => o);
                                option = line.params[j] ?? optionList[0];
                            }
                            return (
                                <AbilityAtomOption
                                    optionName={keyLabel}
                                    key={`ability_option_${i}_${j}`}
                                    type={value}
                                    option={option}
                                    optionList={optionList}
                                    setOption={(o) => {
                                        line.params[j] = o;
                                        ability.params[i] ??= [];
                                        ability.params[i][j] = o;
                                        ability.updateDNA();
                                        updateAbility(ability);
                                    }}
                                ></AbilityAtomOption>
                            );
                        })
                    }
                    {
                        line.params.some(p => p.startsWith("specific")) &&
                        (j = Object.entries(line.atom?.params ?? {}).length) &&
                        <AbilityAtomOption
                            optionName={line.params.find(p => p.startsWith("specific")).replaceAll("-", " ")}
                            key={`ability_option_${i}_${j}`}
                            type={TYPE_PARAM_STRING}
                            option={line.params[j]}
                            setOption={(o) => {
                                line.params[j] = o;
                                ability.params[i] ??= [];
                                ability.params[i][j] = o;
                                ability.updateDNA();
                                updateAbility(ability);
                            }}
                        ></AbilityAtomOption>
                    }
                    {(line.atom?.settings.keywordable) &&
                        <AbilityAtomOption
                            optionName={"detail"}
                            type={"display"}
                            option={ability.lineDisplayOptions[i]}
                            optionList={[DISPLAY_LINE_FULL, DISPLAY_LINE_KEYWORD_WITH_REMINDER, DISPLAY_LINE_KEYWORD_ONLY]}
                            setOption={(o) => {
                                ability.lineDisplayOptions[i] = o;
                                updateAbility(ability);
                            }}
                        ></AbilityAtomOption>
                    }

                </div>
                {/* {line.getString()} */}
            </div>);
        })}
        {/* Add Button */}
        <button className='action' onClick={() => {
            ability.addLine();//use default new line
            updateAbility(ability);
        }}>Add Ability Line</button>
        <div className="abilityPreview"><Markup content={ability.FullTextHtml}></Markup></div>

    </div >);
}
export default AbilityPanel;
