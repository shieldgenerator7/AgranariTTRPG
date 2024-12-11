"use strict";

import { arrayMax, arraySort, getLines } from "../Utility/Utility";
import { costSpec } from "./CostSpec";
import DrawLayer, { DRAWLAYER_BOX, DRAWLAYER_CIRCLE, DRAWLAYER_IMAGE, DRAWLAYER_LAYERS, DRAWLAYER_TEXT } from "./DrawLayer";
import Vector2, { VECTOR2_ZERO } from "./Vector2";

export function generateCardSkin(width, height, margin, padding) {
    const rowheight = height / 17;
    const marginWidth = width - margin * 2;
    const markersY = [
        margin + rowheight * 2.4,
        margin + rowheight * 3.4,
        margin + rowheight * 10.4,
        margin + rowheight * 15.4,
    ];
    let cardSkin = [
        //black
        new DrawLayer(
            DRAWLAYER_BOX,
            'black',
            VECTOR2_ZERO,
            new Vector2(width, height),
        ),
        //background
        new DrawLayer(
            DRAWLAYER_BOX,
            'white',
            new Vector2(margin, margin),
            new Vector2(marginWidth, height - margin * 2),
            (card) => card.colors[0]
        ),
        //image
        new DrawLayer(
            DRAWLAYER_IMAGE,
            undefined,
            new Vector2(margin, markersY[1]),
            new Vector2(marginWidth, markersY[2] - markersY[1]),
            (card) => card.imgPortrait
        ),
        //background
        new DrawLayer(
            DRAWLAYER_BOX,
            'white',
            new Vector2(margin, margin),
            new Vector2(marginWidth, markersY[1] - margin),
            (card) => card.colors[0]
        ),
        //cost circle
        // new DrawLayer(
        //     DRAWLAYER_CIRCLE,
        //     "#00000022",
        //     new Vector2(width - margin - 45, margin + rowheight * 0.7),
        //     new Vector2(rowheight * 0.7, rowheight * 0.7),
        //     (card) => "#FFFFFF22"
        // ),
        //type bg
        new DrawLayer(
            DRAWLAYER_BOX,
            '#dbd69e',
            new Vector2(margin, markersY[0]),
            new Vector2(marginWidth, markersY[1] - markersY[0]),
            (card) => card.colors[1]
        ),
        //text area bg
        new DrawLayer(
            DRAWLAYER_BOX,
            '#dbd69e',
            new Vector2(margin, markersY[2]),
            new Vector2(marginWidth, markersY[3] - markersY[2]),
            (card) => card.colors[1]
        ),
        //text border
        new DrawLayer(
            DRAWLAYER_BOX,
            'black',
            new Vector2(margin, markersY[2]),
            new Vector2(marginWidth, rowheight * 0.2)
        ),
        //card info bg
        new DrawLayer(
            DRAWLAYER_BOX,
            'black',
            new Vector2(margin, markersY[3]),
            new Vector2(marginWidth, rowheight * 2)
        ),
        //base power circle
        new DrawLayer(
            DRAWLAYER_CIRCLE,
            'grey',
            new Vector2(margin + 50, markersY[3] - 50),
            new Vector2(rowheight * .75, rowheight * .75),
            (card) => card.colors[2]
        ),

        //
        // TEXT
        //

        //name
        new DrawLayer(
            DRAWLAYER_TEXT,
            'black',
            new Vector2(margin, margin + rowheight * 0.3),
            new Vector2(marginWidth, rowheight * 0.7),
            (card) => card.name?.trim(),
            (card) => card.colors[3],
            (card) => {
                return {
                    padding: 0,
                    padding_left: 15,
                };
            },
        ),
        //species
        new DrawLayer(
            DRAWLAYER_TEXT,
            'black',
            new Vector2(margin, margin + rowheight * 0.9),
            new Vector2(marginWidth, rowheight * 1.5),
            (card) => card.species?.trim(),
            (card) => card.colors[3],
            (card) => {
                return {
                    padding: 15,
                    padding_left: 15,
                };
            },
        ),

        //tags
        new DrawLayer(
            DRAWLAYER_TEXT,
            'black',
            new Vector2(margin, markersY[0] - rowheight * 0.15),
            new Vector2(marginWidth, markersY[1] - markersY[0]),
            (card) => card.tags.map(t => t.trim()).filter(t => t).join(" • "),
            (card) => card.colors[4],
            (card) => {
                return {
                    padding: 18,
                    padding_left: 15,
                };
            },
        ),

        //cost
        new DrawLayer(
            DRAWLAYER_TEXT,
            'black',
            new Vector2(margin, margin + rowheight * 0.3),
            new Vector2(marginWidth, rowheight * 0.7),
            (card) => costSpec.getTotalCost(card),
            (card) => card.colors[3],
            (card) => {
                return {
                    text_align: "right",
                    padding: 0,
                    padding_left: 15,
                    padding_right: 15,
                };
            },
        ),

        //star count
        new DrawLayer(
            DRAWLAYER_TEXT,
            'black',
            new Vector2(margin, margin + rowheight * 0.8),
            new Vector2(marginWidth, rowheight * 1.5),
            (card) => "★ ".repeat(costSpec.getStarCount(card)).trim(),
            (card) => card.colors[3],
            (card) => {
                return {
                    text_align: "right",
                    padding: 25,
                    padding_left: 15,
                    padding_right: 15,
                };
            },
        ),

        //rest count, abilities, flavor text
        // new DrawLayer(
        //     DRAWLAYER_BOX,
        //     'white',
        //     new Vector2(margin, markersY[2] + rowheight * 0.2),
        //     new Vector2(marginWidth, rowheight * 3.2),
        //     (card) => card.colors[0]
        // ),
        new DrawLayer(
            DRAWLAYER_TEXT,
            'white',
            new Vector2(margin, markersY[2] + rowheight * 0.2),
            new Vector2(marginWidth, rowheight * 3.2),
            (card) => {
                let restLine = card.getRestText(card.showReminderText);
                let flavorLine = `_${card.flavorText.trim()}_`;
                let abilityLines;
                abilityLines = card.abilities.map(ability => ability.FullText);
                return [
                    restLine,
                    abilityLines,
                    flavorLine
                ]
                    .flat(Infinity)
                    .filter(l => l)
                    .join("\n \n");
            },
            (card) => card.colors[4],
            (card) => {
                return {
                    text_align: "left",
                    max_text_height: rowheight * 0.38,
                    padding: 15,
                };
            },
        ),

        //base power
        // new DrawLayer(
        //     DRAWLAYER_BOX,
        //     'white',
        //     new Vector2(margin + rowheight * 0.17, markersY[3] - rowheight * 1.45),
        //     new Vector2(rowheight * 1.28, rowheight * 1.28),
        //     (card) => card.colors[1],
        // ),
        new DrawLayer(
            DRAWLAYER_TEXT,
            'white',
            new Vector2(margin + rowheight * 0.17, markersY[3] - rowheight * 1.4),
            new Vector2(rowheight * 1.28, rowheight * 0.9),
            (card) => card.basePower,
            (card) => card.colors[5],
            (card) => {
                return {
                    text_align: "center",
                    padding: 0,
                };
            },
        ),

        // Biome Modifiers
        new DrawLayer(
            DRAWLAYER_LAYERS,
            undefined,
            undefined,
            undefined,
            (card) => arraySort(
                [...card.biomeModifiers],
                (bm) => bm.modifier * -1
            )
                .map((bm, i) => {
                    const startX = margin + 50 + rowheight * 0.85;
                    const bmWidth = rowheight * 1.5;
                    const areaSize = rowheight * 1.4;
                    const areaSizeHalf = areaSize / 2;
                    const boxLessAmount = 7;
                    return [
                        //Circle
                        new DrawLayer(
                            DRAWLAYER_CIRCLE,
                            'grey',
                            new Vector2(startX + (bmWidth * i) + areaSizeHalf, markersY[3] - 50),
                            new Vector2(areaSizeHalf, areaSizeHalf),
                            (card) => card.colors[2]
                        ),
                        //Biome Box
                        new DrawLayer(
                            DRAWLAYER_BOX,
                            'white',
                            new Vector2(startX + (bmWidth * i), markersY[3] - (50 - boxLessAmount) - areaSizeHalf),
                            new Vector2(areaSize, areaSizeHalf - boxLessAmount),
                            (card) => card.colors[2],
                        ),
                        //Biome
                        new DrawLayer(
                            DRAWLAYER_TEXT,
                            'white',
                            new Vector2(startX + (bmWidth * i), markersY[3] - 47 - areaSizeHalf),
                            new Vector2(areaSize, areaSizeHalf),
                            (card) => bm.biome,
                            (card) => card.colors[5],
                            (card) => {
                                return {
                                    text_align: "center",
                                    padding: rowheight * 0.1,
                                    max_text_height: rowheight * 0.25,
                                };
                            },
                        ),
                        new DrawLayer(
                            DRAWLAYER_TEXT,
                            'white',
                            new Vector2(startX + (bmWidth * i) + (areaSize - areaSize * .75) / 2, markersY[3] - rowheight * 0.93),
                            new Vector2(areaSize * .75, areaSize * .4),
                            (card) => `${(bm.modifier > 0) ? "+" : ""}${bm.modifier}`,
                            (card) => card.colors[5],
                            (card) => {
                                return {
                                    text_align: "center",
                                    padding: 0,//rowheight * 0.1,
                                };
                            },
                        ),
                    ];
                })
        ),
    ];
    return cardSkin;
}
