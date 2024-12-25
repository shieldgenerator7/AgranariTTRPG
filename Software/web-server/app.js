//2024-12-13: created by following tutorial: https://youtu.be/HXquxWtE5vA?si=nkCgddL8dMa5fmEF
"use strict";

const express = require('express');
const app = express();

//socket.io setup
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const port = 3000;

app.use(express.static('public'));
app.use(express.static('src'));//TODO: move src folder into public folder?

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