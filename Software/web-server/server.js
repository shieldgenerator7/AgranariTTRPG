"use strict";
//2019-04-04: copied from https://stackoverflow.com/a/41550669/2336212
//2024-12-13: created by following tutorial: https://youtu.be/HXquxWtE5vA?si=nkCgddL8dMa5fmEF

const express = require('express');
const app = express();

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3001;

app.use(express.static('public'));
app.use(express.static(__dirname + '/')); //__dir and not _dir

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('user connected', socket);
})

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

console.log('server loaded!');