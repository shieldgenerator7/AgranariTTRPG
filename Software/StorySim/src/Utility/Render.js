"use strict";

import { FIT_WHOLE, FIT_WIDTH, FIT_HEIGHT, FIT_FILL } from "../Data/Creature";
import { DRAWLAYER_BOX, DRAWLAYER_CIRCLE, DRAWLAYER_IMAGE, DRAWLAYER_LAYERS, DRAWLAYER_TEXT } from "../Data/DrawLayer";
import Vector2, { VECTOR2_ZERO } from "../Data/Vector2";
import { VERSION } from "../Version";
import { arraySort, getDateString, getLines } from "./Utility";

//
// Renders the given card to the given canvas with the given draw layers
//

export const RESOLUTION = 300;

export function renderCard(card, canvas, drawData) {
    const context = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    //Add layers as needed
    drawData = drawData.map(layer => {
        if (layer.type != DRAWLAYER_LAYERS) { return layer; }
        return layer.getInfo(card);
    }).flat(Infinity);
    //Process layers
    drawData.forEach(draw => {
        switch (draw.type) {
            case DRAWLAYER_BOX:
                context.fillStyle = draw.getInfo(card) ?? draw.color;
                context.fillRect(draw.position.x, draw.position.y, draw.size.x, draw.size.y);
                break;
            case DRAWLAYER_CIRCLE:
                context.beginPath();
                context.arc(
                    draw.position.x,
                    draw.position.y,
                    draw.size.x,
                    0,
                    2 * Math.PI
                );
                context.fillStyle = draw.getInfo(card) ?? draw.color;
                context.fill();
                break;
            case DRAWLAYER_IMAGE:
                let img = draw.getInfo(card);
                if (!img) { return; }
                //fit picture
                let pos = draw.position.clone();
                let size = draw.size.clone();
                let width = img.width;
                let height = img.height;
                let spos = VECTOR2_ZERO.clone();
                let ssize = new Vector2(img.width, img.height);
                if (width != size.x || height != size.y) {
                    let wRatio = size.x / width;
                    let hRatio = size.y / height;
                    const fitWidth = () => {
                        let newHeight = height * wRatio;
                        let newY = pos.y + (size.y - newHeight) / 2;
                        if (newHeight > size.y) {
                            let diff = (newHeight - size.y) / wRatio;
                            ssize.y = height - diff;
                            spos.y = 0 + diff / 2;
                        }
                        else {
                            size.y = newHeight;
                            pos.y = newY;
                        }
                    };
                    const fitHeight = () => {
                        let newWidth = width * hRatio;
                        let newX = pos.x + (size.x - newWidth) / 2;
                        if (newWidth > size.x) {
                            let diff = (newWidth - size.x) / hRatio;
                            ssize.x = width - diff;
                            spos.x = 0 + diff / 2;
                        }
                        else {
                            size.x = newWidth;
                            pos.x = newX;
                        }
                    };
                    switch (card.imageFit) {
                        case FIT_WHOLE:
                            if (wRatio < hRatio) {
                                fitWidth();
                            }
                            else {
                                fitHeight();
                            }
                            break;
                        case FIT_FILL:
                            if (wRatio > hRatio) {
                                fitWidth();
                            }
                            else {
                                fitHeight();
                            }
                            break;
                        case FIT_WIDTH:
                            fitWidth();
                            break;
                        case FIT_HEIGHT:
                            fitHeight();
                            break;
                        default:
                            console.error("unknown fit:", card.imageFit);
                    }

                }
                //draw
                context.drawImage(
                    img,
                    spos.x, spos.y, ssize.x, ssize.y,
                    pos.x, pos.y, size.x, size.y,
                );
                break;
            case DRAWLAYER_TEXT:
                let text = `${draw.getInfo(card)}`;
                if (!text) { return; }
                //compress text to keep keywords together with their number (undone below)
                text = text.replaceAll(/\*([A-Z][a-z]+) ([0-9]+)\*/g, "*$1$2*");
                //
                const format = draw.getFormat(card) ?? {};
                const padding = format.padding ?? draw.size.y * 0.05;
                const padLeft = format.padding_left ?? padding;
                const padRight = format.padding_right ?? padding;
                const MAX_WIDTH_TEXT = draw.size.x - padLeft - padRight;
                let fontSize;
                let lines = text.split("\n");
                let prevFontSize = 0;
                let i = 0;
                for (i = 0; i < 1000; i++) {
                    fontSize = Math.min(
                        format.max_text_height || Infinity,
                        (draw.size.y - (padding * 2)) / lines.length
                    );
                    context.font = `${fontSize}px Arial`;
                    lines = text
                        .split("\n")
                        .map(line => getLines(context, line, MAX_WIDTH_TEXT))
                        .flat(Infinity)
                        .filter(l => l);
                    if (i % 2 == 1) {
                        if (Math.abs(prevFontSize - fontSize) < 0.01) { break; }
                        prevFontSize = fontSize;
                    }
                }
                //If line is too big for area, decrease font size
                if (lines.length == 1) {
                    let textwidth = context.measureText(lines[0]).width;
                    let drawSizePad = draw.size.x - padLeft - padRight;
                    if (textwidth > drawSizePad) {
                        let ratio = drawSizePad / textwidth;
                        fontSize *= ratio;
                        context.font = `${fontSize}px Arial`;
                    }
                }
                //uncompress text to put space between keywords and their number
                //this is done to prevent the line break falling between a keyword and its number
                lines = lines.map(line =>
                    line.replaceAll(/\*([A-Z][a-z]+)([0-9]+)\*/g, "*$1 $2*")
                );
                //
                const textalign = format.text_align ?? "left";
                const LINEHEIGHT = 0.1 * RESOLUTION;
                const boldSymbol = "*";
                const italicSymbol = "_";
                let bold = false;
                let italic = false;
                const startY = draw.position.y + (padding * 1.3) + fontSize;
                const bufferY = fontSize;
                context.fillStyle = draw.getColor(card) ?? draw.color;
                lines.forEach((line, i) => {
                    line = `${line}`.trim();
                    if (!line) {
                        bold = false;
                        italic = false;
                        return;
                    }
                    const measurement = context.measureText(
                        line.replaceAll(boldSymbol, "").replaceAll(italicSymbol, "")
                    );
                    let x;
                    switch (textalign) {
                        case "left":
                            x = draw.position.x + padLeft;
                            break;
                        case "right":
                            x = draw.position.x + draw.size.x - measurement.width - padRight;
                            break;
                        case "center":
                            let diff = draw.size.x - measurement.width - padLeft - padRight;
                            x = draw.position.x + diff / 2 + padLeft;
                            break;
                        default:
                            console.error("unknown textalign value: ", textalign);
                    }
                    let y = startY + bufferY * i;
                    [...line].forEach(char => {
                        if (char == boldSymbol) {
                            bold = !bold;
                            return;
                        }
                        if (char == italicSymbol) {
                            italic = !italic;
                            return;
                        }
                        //write char
                        context.font = `${(bold) ? "bold " : ""}${(italic) ? "italic " : ""}${fontSize}px Arial`;
                        context.fillText(
                            char,
                            x,
                            y
                        );
                        x += context.measureText(char).width;
                    });
                });
                break;
            case DRAWLAYER_LAYERS:
                //do nothing, the layers it added is processed above
                break;
            default:
                console.error("unknown draw layer type:", draw.type);
        }
    });

    // Back Boxes
    const bufferBase = 0.1 * RESOLUTION;
    const textRow = 0.25 * RESOLUTION;

    //Ability Cost (TEST)
    // context.beginPath();
    // context.arc(
    //     bufferBase * 8.35,
    //     textRow * 10.4,
    //     15,
    //     0,
    //     2 * Math.PI
    // );
    // context.fillStyle = 'grey';
    // context.fill();

    // text

    context.fillStyle = card.colors[3];
    let fontSize;

    //Ability Cost (TEST)
    // context.fillStyle = 'white';
    // fontSize = 0.3;
    // context.font = `${textRow * fontSize}px Arial`;
    // context.fillText(
    //     "-1",
    //     0 + bufferBase * 8,
    //     textRow * 10.5
    // );
    //

    //Card Info
    let creditsX = 0 + bufferBase * 2.9;
    let creditsY = height - bufferBase * 1.4;
    context.fillStyle = 'white';
    fontSize = 0.2;
    context.font = `${textRow * fontSize}px Arial`;
    context.fillText(
        "Id: " + card.id,
        creditsX,
        creditsY
    );
    context.fillText(
        "Variant: " + card.variant,
        creditsX + bufferBase * 6,
        creditsY
    );
    const oneOrBoth = (saved, current, extra = "") => {
        let str = `${extra}${saved}`;
        if (saved != current) {
            str += ` - ${extra}${current}`;
        }
        return str;
    };
    let dateString = oneOrBoth(card.creationDate, getDateString());
    context.fillText(
        `Creation Date: ${dateString}`,
        creditsX + bufferBase * 12,
        creditsY
    );
    let versionString = oneOrBoth(card.editorVersion, VERSION, "v");
    context.fillText(
        `www.creaturecombat.io           ${versionString}`,
        creditsX + bufferBase * 0.2,
        creditsY + bufferBase / 2
    );
}
