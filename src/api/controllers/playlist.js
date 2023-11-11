import { Song } from './song';

const db = require('../models');
const Playlist = db.playlists;
const Playlist_song = db.playlist_songs;

export const getAllPlaylists = async (req, res) => {
    Playlist.findAll().then(playlistsFound => {
        res.json(playlistsFound);
    });
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