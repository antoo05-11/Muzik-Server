import path from 'path';
import { Song, fileServerURL } from './song';
import playlist_song from '../models/playlist_song';

const db = require('../models');
const Playlist = db.playlists;
const Playlist_song = db.playlist_songs;
const User = db.users;
// Playlist.hasMany(Song)
Playlist.belongsTo(User, { foreignKey: 'userID' });
Playlist_song.belongsTo(Playlist, { foreignKey: 'playlistID' });

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
        let clone = { ...songFound.get() };
        clone.imageURL = fileServerURL + songFound.imageURL;
        clone.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../../../song/stream/' + clone.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));
        result.push(clone);
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

export const addSongToPlaylist = async (req, res) => {
    const playlistSong = await Playlist_song.create(
        {
            playlistID: req.params.id,
            songID: req.body.songID,
            dateAdded: '2023-12-30'
        }
    )
    await Playlist_song.save()
    return res.status(200).json(playlistSong)
}