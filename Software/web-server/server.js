"use strict";
//2019-04-04: copied from https://stackoverflow.com/a/41550669/2336212
//2024-12-13: created by following tutorial: https://youtu.be/HXquxWtE5vA?si=nkCgddL8dMa5fmEF

const PORT_CLIENT = 3000;
const PORT_SERVER = 3001;

const express = require('express');
const app = express();

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// const { storeCharacter, getCharacterNameList, loadCharacter } = require('./storage');
const io = new Server(
    server,
    {
        pingInterval: 2000,
        pingTimeout: 5000,
        //2024-12-24: copied from https://socket.io/docs/v3/handling-cors/
        cors: {
            origin: true,//`http://localhost:${PORT_CLIENT}`,
            methods: ["GET", "POST"],
        }
    }
);

app.use(express.static('public'));
app.use(express.static(__dirname + '/')); //__dir and not _dir

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const gameData = {
    players: {},
    characters: {},
    rollers: [],
};

let storage = undefined;
//populate characters list
let characterList = getCharacterNameList();
characterList.forEach(charName => {
    let character = loadCharacter(charName);
    gameData.characters[charName] = character;
})

io.on('connection', (socket) => {
    console.log('player connected', socket.id);
    let player = {
        x: 100,
        y: 100,
    };
    gameData.players[socket.id] = player;

    io.emit('updateGameData', gameData);

    socket.join(socket.id);
    io.to(socket.id).emit("storage", storage,);

    socket.on('disconnect', (reason) => {
        console.log("player disconnected:", socket.id, reason);
        delete gameData.players[socket.id];
        io.emit('updateGameData', gameData);
    });

    socket.on("onDiceRolled", ({ characterName, statName, roll }) => {
        console.log("Dice rolled!", characterName, statName, roll);
        io.emit("onDiceRolled", { characterName: characterName, statName: statName, roll: roll });
    });

    socket.on("storage", (storage) => {
        storage = storage;
        // io.emit("storage", storage); 
    });

    socket.on("submitCharacter", (character) => {
        if (Object.hasOwn(gameData.characters, character.name)) {
            console.warn("cant add character with name", character.name, "because a character with that name already exists!");
            return;
        }
        gameData.characters[character.name] = character;
        io.emit("characterSubmitted", {
            socketId: socket.id,
            character: character,
        });
    });

    socket.on("characterUpdated", ({ socketId, character }) => {

        gameData.characters[character.name] = character;

        storeCharacter(character);


        io.emit("characterUpdated", { socketId: socketId, character: character });
    });

    // socket.on("rollerAdded", ({ socketId, roller }) => {
    //     gameData.rollers.push(roller.title);
    //     io.emit("rollerAdded", { socketId: socketId, roller: roller }); 
    // });

    socket.on("rollerUpdated", ({ socketId, rollerList }) => {
        // gameData.rollers[0] = roller;//TODO: make it find the right roller
        io.emit("rollerUpdated", { socketId: socketId, rollerListIn: rollerList });
    });

    // socket.on("rollerRemoved", ({ socketId, roller }) => {
    //     gameData.rollers.splice(0,1);//TODO: make it find the right roller
    //     io.emit("rollerRemoved", { socketId: socketId, roller: roller }); 
    // });



    console.log("gameData", gameData);
});

server.listen(PORT_SERVER, () => {
    console.log(`App listening on port ${PORT_SERVER}`);
});

console.log('server loaded!');


















//
//
// 2025-01-22: this section copied from storage.js
// theyre meant to be two separate files, but the module thing wasnt working
// putting the storage.js functions here made it work, so that's what i did (for now)
//
//

//2025-01-21: copied from https://stackoverflow.com/a/77181535/2336212
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const REGION = "us-east-1";

let s3 = new S3Client({ region: REGION });

const BUCKET_NAME = "agranari-characters";



function getCharacterNameList() {
    return [];
}

async function storeCharacter(character) {
    //2025-01-21: copied from https://stackoverflow.com/a/77181535/2336212
    const params = getParams(character);
    // Create an object and upload it to the Amazon S3 bucket.
    try {
        const results = await s3.send(new PutObjectCommand(params));
        console.log(
            "Successfully created " +
            params.Key +
            " and uploaded it to " +
            params.Bucket +
            "/" +
            params.Key
        );
        return results; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
}

function loadCharacter(characterName) {
    return {};
}

function getKey(characterName) {
    return `${characterName}.json`;
}
function getParams(character) {
    return {
        Bucket: BUCKET_NAME,
        Key: getKey(character.name),
        Body: JSON.stringify(character),
    };
}