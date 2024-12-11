"use strict";

import React from 'react';
import { UploadFromFilePicker } from '../Utility/Upload';
import { FIT_WHOLE, FIT_WIDTH, FIT_HEIGHT, FIT_FILL } from '../Data/Creature';
import { biomeList } from '../Data/BiomeModifier';
import { abilityCosts, abilityEffects, abilityRequirements } from '../Data/Ability/AbilityData';
import { arrayRemoveDuplicates, arraySortOnFrequency, makeUserFacing } from '../Utility/Utility';
import Counter from './Counter';
import AbilityPanel from './AbilityPanel';
import { costDisplay, costSpec } from '../Data/CostSpec';
import SuggestionList from './SuggestionList';
import { downloadFile } from '../Utility/Download';

function EditPanel({ card, cardList, setCard, updateCard, openPanel }) {
    return (
        <div className="editPanel">

            {/* Header */}
            <div>
                {card.getNameText(true) || `[${[card.tags[0], "creature"].filter(a => a).join(" ")}]`}
                {costDisplay(costSpec.getTotalCost(card), false, true, false)}
            </div>

            {/* Name */}
            Name
            <input type="text" className="field" onChange={(e) => {
                card.name = e.target.value;
                updateCard(card);
            }}
                value={card.name}></input>

            {/* Species */}
            Species
            <input type="text" className="field" onChange={(e) => {
                card.species = e.target.value;
                updateCard(card);
            }}
                value={card.species}></input>

            {/* Tags */}
            Type
            <input type="text" className="field" onChange={(e) => {
                let tags = "" + e.target.value;
                card.setTags(tags);
                updateCard(card);
            }}
                value={card.tags.join(" ")}></input>
            <SuggestionList
                suggestionList={
                    arraySortOnFrequency(
                        cardList
                            .map(card => card.tags)
                            .flat(Infinity)
                            .concat(
                                ["Insect", "Cervid", "Feline", "Canine", "Robot", "Plant", "Artifact"]
                            )
                    )
                        .filter(tag => !card.tags.includes(tag))
                }
                onSuggestionTaken={(suggestion) => {
                    card.tags.push(suggestion);
                    updateCard(card);
                }}
            ></SuggestionList>

            {/* Base Power */}
            Base Power {costDisplay(costSpec.basePowerFunc(card.basePower))}
            <Counter
                value={card.basePower}
                setValue={(v) => {
                    card.basePower = v;
                    updateCard(card);
                }}></Counter>

            {/* Rest Count */}
            Rest Count {costDisplay(costSpec.restFunc(card.rest), true, false)}
            <div className='info'>
                Show Reminder Text
                <input type="checkbox" checked={card.showReminderText}
                    onChange={() => {
                        card.showReminderText = !card.showReminderText;
                        updateCard(card);
                    }}
                />
            </div>
            <Counter
                value={card.rest}
                setValue={(v) => {
                    card.rest = v;
                    updateCard(card);
                }}
            ></Counter>

            {/* Biome Modifiers */}
            Biome Modifiers {costDisplay(costSpec.biomeModifierAllFunc(card.biomeModifiers, card.basePower), true)}
            {
                card.biomeModifiers.map((bm, i) => {
                    const biomeFunc = (e) => {
                        bm.biome = e.target.value;
                        updateCard(card);
                    };
                    return (<div className='fieldLine' key={"divBM_" + i}>
                        {/* Biome */}
                        <select className="sltBiome" value={bm.biome} onChange={biomeFunc}>
                            {
                                biomeList
                                    .filter(b => !card.hasBiome(b) || bm.biome == b)
                                    .map(b => (
                                        <option value={b} key={b}>{b}</option>
                                    ))
                            }
                        </select>
                        {/* Modifier */}
                        <Counter
                            value={bm.modifier}
                            setValue={(v) => {
                                bm.modifier = v;
                                updateCard(card);
                            }}
                            allowNegative={true}
                            inline={true}
                        ></Counter>

                        {/* Biome Modifier Point Cost */}
                        {costDisplay(costSpec.biomeModifierFunc(bm.modifier), true)}

                        {/* Remove Button */}
                        <button className="ex" onClick={() => {
                            card.biomeModifiers.splice(i, 1);
                            updateCard(card);
                        }}>X</button>
                    </div>);
                })
            }
            {card.biomeModifiers.length < 5 && (<>
                {/* Suggest Biome Modifier */}
                <SuggestionList
                    suggestionList={
                        arraySortOnFrequency(
                            cardList
                                .map(card => card.biomeModifiers.map(bm => bm.biome))
                                .flat(Infinity)
                                .concat(biomeList)
                        )
                            .filter(bm => !card.hasBiome(bm))
                    }
                    onSuggestionTaken={(suggestion) => {
                        card.addBiomeModifier(suggestion, 0);
                        updateCard(card);
                    }}
                ></SuggestionList>
                {/* Add Button */}
                <button className='action' onClick={() => {
                    card.addBiomeModifier("", 0);
                    updateCard(card);
                }}>Add Biome Modifier</button>
            </>)}

            {/* Abilities */}
            Abilities {costDisplay(costSpec.abilityAllFunc(card.abilities))}
            {
                card.abilities.map((ability, i) => {
                    return (
                        <div className='info' key={`ability_${i}`}>{ability.name || `Ability ${i + 1}`} {costDisplay(costSpec.abilityFunc(ability))}</div>
                        // <AbilityPanel
                        //     key={`_ability_${i}`}
                        //     ability={ability}
                        //     updateAbility={(a) => {
                        //         card.abilities[i] = a;
                        //         card.abilities = card.abilities.filter(a => a);
                        //         updateCard(card);
                        //     }}
                        // ></AbilityPanel>
                    );
                })
            }
            <div>
                <button className='action' onClick={(e) => {
                    openPanel("ability", true);
                }}>Edit Abilities</button>
            </div>

            {/* Flavor Text */}
            Flavor Text
            <textarea className="field multiline" onChange={(e) => {
                card.flavorText = e.target.value;
                updateCard(card);
            }}
                rows="5"
                value={card.flavorText}
            ></textarea>

            {/* Card Art */}
            Card Art
            {
                !card.imageURL && (<>
                    <div className='info'>Recommended: 690x483</div>
                    <button className="action" onClick={() => {
                        UploadFromFilePicker("image/*", false, (imageURL, filename) => {
                            card.imageURL = imageURL;
                            card.imageFileName = filename;
                            if (card.imageURL) {
                                let creatureImage = new Image();
                                creatureImage.src = card.imageURL;
                                creatureImage.onload = () => {
                                    card.imgPortrait = creatureImage;
                                    updateCard(card);
                                };
                            }
                            else {
                                updateCard(card);
                            }
                        });
                    }}>Upload</button>
                </>)
            }
            {
                card.imageURL && (
                    <div>
                        <div className='info'>
                            {card.imageFileName ?? "Portrait"}
                            {/* Remove Button */}
                            <button className="ex" onClick={() => {
                                card.imageURL = undefined;
                                card.imageFileName = undefined;
                                card.imgPortrait = undefined;
                                updateCard(card);
                            }}>X</button>
                        </div>
                        <div className='info'>Portrait Fit
                            <select onChange={(e) => {
                                let value = e.target.value * 1;
                                card.imageFit = value;
                                updateCard(card);
                            }}
                                value={card.imageFit}>
                                <option value={FIT_WHOLE}>Whole</option>
                                <option value={FIT_FILL}>Fill</option>
                                <option value={FIT_WIDTH}>Width</option>
                                <option value={FIT_HEIGHT}>Height</option>
                            </select>
                        </div>
                    </div>
                )
            }

            {/* Text Color */}
            Style
            <div className='info'>Text Color</div>
            <div>
                {
                    card.colors
                        .filter((c, i) => i >= 3)
                        .map((color, i) => (<span className='colorInput' key={"tc_" + i}>
                            {i + 1}
                            <input type="color" value={color ?? "#FFFFFF"} onChange={(e) => {
                                card.colors[i + 3] = e.target.value;
                                updateCard(card);
                            }}></input>
                        </span>))
                }
            </div>

            {/* Background Color */}
            <div className='info'>Background Color</div>
            <div>
                {
                    card.colors
                        .filter((c, i) => i < 3)
                        .map((color, i) => (< span className='colorInput' key={"bgc_" + i}>
                            {i + 1}
                            <input type="color" value={color ?? "#FFFFFF"} onChange={(e) => {
                                card.colors[i] = e.target.value;
                                updateCard(card);
                            }}></input>
                        </span>))
                }
            </div>

            {/* Copy+Paste Color */}
            <div className='info'>Copy Colors</div>
            <div>
                <button className='action' onClick={(e) => {
                    window.copiedColors = [...card.colors];
                }}>
                    Copy Colors
                </button>
                {window.copiedColors && (
                    <button className='action' onClick={(e) => {
                        card.colors = [...window.copiedColors];
                        updateCard(card);
                    }}>
                        Paste Colors
                    </button>
                )}
            </div>
        </div>
    );
}

export default EditPanel;
