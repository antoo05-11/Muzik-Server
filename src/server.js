import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./api/routes";

dotenv.config();

var http = require('http');
var app = express();
var server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.json());
app.use(cookieParser());

app.use("/src/public", express.static('./src/public/'));
app.use(cors({
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

io.on('connection', async (socket) => {

    socket.on('createRoom', async (userID) => {
        let roomID = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        if (!rooms[roomID]) {
            rooms[roomID] = [];
            songs[roomID] = [];
        }
        io.to(socket.id).emit('roomCreated', roomID);
    });

    socket.on('joinRoom', async (room, userID) => {
        if (!rooms[room]) {
            io.to(socket.id).emit('roomJoin', false);
            return;
        }

        rooms[room].push(userID);

        socket.join(room);
        io.to(socket.id).emit('roomJoin', true, rooms[room].length);
        io.to(room).emit('newUser', userID, rooms[room].length);

        if (rooms[room].length == 1) {
            let song = await db.songs.findOne({ where: { songID: Math.floor(Math.random() * 5) + 1 } })
            songs[room].push(song.songID);
            curSongs[room] = song.songID;
            curTimes[room] = 0;

            io.to(room).emit('playSong', song.songID)
            io.to(room).emit('updateSongList', songs[room]);
            setInterval(() => {
                if (curTimes[room] < song.duration)
                    curTimes[room]++;
            }, 1);
        } else {
            io.to(socket.id).emit('continueSong', curSongs[room], curTimes[room]);
        }
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

    socket.on('addSongToRoom', async (roomID, songID) => {
        if (parseInt(songID) == NaN) io.to(roomID).emit('updateSongList', false);
        if (!songs[roomID].includes(parseInt(songID))) {
            let song = await db.songs.findByPk(songID);
            if (song) {
                songs[roomID].push(parseInt(songID));
            }
        }
        io.to(roomID).emit('updateSongList', songs[roomID]);
        return;
    });
}); 