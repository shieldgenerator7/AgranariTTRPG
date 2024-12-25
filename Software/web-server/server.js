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
const io = new Server(
    server,
    {
        pingInterval: 2000,
        pingTimeout: 5000,
        //2024-12-24: copied from https://socket.io/docs/v3/handling-cors/
        cors: {
            origin: `http://localhost:${PORT_CLIENT}`,
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
};

io.on('connection', (socket) => {
    console.log('player connected', socket.id);
    gameData.players[socket.id] = {
        x: 100,
        y: 100,
    };

    io.emit('updateGameData', gameData);

    socket.on('disconnect', (reason) => {
        console.log("player disconnected:", socket.id, reason);
        delete gameData.players[socket.id];
        io.emit('updateGameData', gameData);
    });

    socket.on("onDiceRolled", ({ characterName, statName, roll })=> {
        console.log("Dice rolled!", characterName, statName, roll);
    });

    console.log("gameData", gameData);
})

server.listen(PORT_SERVER, () => {
    console.log(`App listening on port ${PORT_SERVER}`);
});

console.log('server loaded!');



