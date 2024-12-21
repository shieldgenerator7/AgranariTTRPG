"use strict";
import { Server } from 'socket.io';
import { http } from 'http';
import { express }  from 'express';

export function createServer(port, charName) {
    //2024-12-21: copied from https://youtu.be/HXquxWtE5vA?si=5uTdYw31amWj43kM&t=1537
    const app = express();
    app.use(express.static('public'));
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
    const server = http.createServer(app);
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log("user connected with character", charName);
    });
    server.listen(port, () => {
        console.log("Agranari TTRPG listening on port ", port);
    });
    console.log("server loaded!", port);
}
