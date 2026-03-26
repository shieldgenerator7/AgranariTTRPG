"use strict";

export const biomeList = [
    "Cloud",
    "Desert",
    "Forest",
    "Jungle",
    "Lake",
    "Mountain",
    "Ocean",
    "Plain",
    "Swamp",
    "Tundra",
    "Volcano",
    "Wasteland",
];

class BiomeModifier {
    constructor(biome, modifier) {
        this.biome = biome;
        this.modifier = modifier;
    }
}

export default BiomeModifier;
