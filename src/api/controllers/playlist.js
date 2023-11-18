import { Song, fileServerURL } from './song';

const db = require('../models');
const Playlist = db.playlists;
const Playlist_song = db.playlist_songs;
const User = db.users;

Playlist.belongsTo(User, { foreignKey: 'userID' });
Playlist_song.belongsTo(Playlist,{ foreignKey: 'playlistID' });

export const getAllPlaylists = async (req, res) => {
    const playlists = await Playlist.findAll({
        include: {
            model: User,
            attribute: ['userID']
        }
    })
    if (!playlists) return res.status(404);

    let result = [];
    for (const playlist of playlists) {
        let clone = { ...playlist.get() };

        result.push(clone);
    }
    return res.status.json(result);
};

export const getAllSongs = async (req, res) => {
    let songsFound = await Playlist_song.findAll({ where: { playlistID: req.params.id } });
    let result = [];
    for (const song of songsFound) {
        let songFound = await Song.findOne({ where: { songID: song.songID } });
        result.push(songFound);
    }
    res.json(result);
};

export const getTopPlaylist = async (req, res) => {
    let playlists = await Playlist.findAll({
       
    });
    let result = [];
    for (const playlist of playlists) {
        let clone = { ...playlist.get() };
        clone.imageURL = fileServerURL + playlist.imageURL;
        result.push(clone);
    }
    return res.status(200).json(result);
}