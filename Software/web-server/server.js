"use strict";
//2019-04-04: copied from https://stackoverflow.com/a/41550669/2336212
//2024-12-13: created by following tutorial: https://youtu.be/HXquxWtE5vA?si=nkCgddL8dMa5fmEF

const PORT_CLIENT = 3000;
const PORT_SERVER = 3001;

import express from 'express';
const app = express();

//socket.io setup
import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';
import { storeCharacter, getCharacterNameList, loadCharacter } from './storage.js';
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
app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile('./index.html');
});

const gameData = {
    players: {},
    characters: {},
    rollers: [],
};

let storage = undefined;
//populate characters list
let characterList = getCharacterNameList();
characterList.push("Wryonin");//test code
characterList.forEach(charName => {
    loadCharacter(charName).then((response) => {
        response.Body.transformToString().then(res => {
            let character = JSON.parse(res);
            gameData.characters[charName] = character;
            console.log("character loaded!", charName, character);
        });
    });
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
