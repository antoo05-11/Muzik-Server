import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";
import { downloadYT } from "./api/controllers/song";

dotenv.config();

var http = require('http');
var app = express();
var server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.json());
app.use(cookieParser());

app.use("/src/public", express.static('./src/public/'));
app.use(cors({
    origin: "http://localhost:6600",
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: "**"
}));

app.use((err, req, res, next) => {
    const {
        status = 404, message = "Error"
    } = err;
    res.status(status).json({
        message
    });
});

const PORT = process.env.PORT || 5050;;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.use("/api", router);

app.use("/", (req, res) => {
    res.status(200).json("Hello!");
})

const db = require('../src/api/models')

const rooms = {};
const songs = {};
const curSongs = {};
const curTimes = {};
io.on('connection', (socket) => {
    socket.on('createRoom', async (userID) => {
        let roomID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        if (!rooms[roomID]) {
            rooms[roomID] = [];
            songs[roomID] = [];
        }

        rooms[roomID].push(userID);

        let song = await db.songs.findOne({ where: { songID: Math.floor(Math.random() * 5) + 1 } })
        songs[roomID].push(song.songID);
        curSongs[roomID] = song.songID;
        curTimes[roomID] = 0;

        socket.join(roomID);
        io.to(socket.id).emit('roomCreated', roomID);

        io.to(roomID).emit('playSong', song.songID)
        setInterval(() => {
            if (curTimes[roomID] < song.duration)
                curTimes[roomID]++;
        }, 1);
    });

    socket.on('joinRoom', (room, userID) => {
        if (!rooms[room]) {
            io.to(socket.id).emit('roomJoin', false);
            return;
        }

        io.to(socket.id).emit('roomJoin', true);

        socket.join(room);
        rooms[room].push(userID);

        io.to(room).emit('newUser', userID, rooms[room].length);
        io.to(socket.id).emit('continueSong', curSongs[room], curTimes[room])
    });

    socket.on('changeSong', (data) => {
        io.to(data.room).emit('playSong', data.song);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        rooms[room] = rooms[room].filter(id => id !== socket.id);
        io.to(room).emit('updateUsers', rooms[room]);
    });

    socket.on('messageToRoom', async (roomID, userID, message) => {
        let user = await db.users.findOne({ where: { userID: userID } });
        if (user) {
            user = { ...user.get() }
            delete user.password
            io.to(roomID).emit('messageFromRoom', user, message);
        }
    });
}); 