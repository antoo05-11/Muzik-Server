import path from 'path';
import { Song, fileServerURL } from './song';
import playlist_song from '../models/playlist_song';
import { sequelize } from '../models';
import { Artist, Playlist, Playlist_song, User } from '../models/model-export';

export const getAllPlaylists = async (req, res) => {
    const playlists = await Playlist.findAll({
        where: { userID: req.user.userID }
    })
    if (!playlists) return res.status(404);

    let result = [];
    for (let playlist of playlists) {
        playlist = { ...playlist.get() };
        if (!playlist.imageURL) playlist.imageURL = "playlist_images/0.png"
        playlist.imageURL = fileServerURL + playlist.imageURL;
        result.push(playlist);
    }
    return res.status(200).json(result);
};

export const getAllSongs = async (req, res) => {
    let songs = await Playlist_song.findAll({
        where: { playlistID: req.params.id },
        include: {
            model: Song,
            include: {
                model: Artist
            }, required: true
        }
    });

    let result = [];
    for (let song of songs) {
        song = { ...song.song.get() }

        song.imageURL = fileServerURL + song.imageURL;
        song.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl,
            '../../../song/stream/' + song.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));

        song.artistID = song.artist.artistID;
        song.artistName = song.artist.name;
        delete song.artist;

        result.push(song);
    }

    return res.status(200).json(result);
};

export const getTopPlaylist = async (req, res) => {
    let playlists = await Playlist.findAll({
        where: {
            type: "PUBLIC"
        }
    });
    let result = [];
    for (let playlist of playlists) {
        playlist = { ...playlist.get() };
        if (!playlist.imageURL) playlist.imageURL = "playlist_images/0.png"
        playlist.imageURL = fileServerURL + playlist.imageURL;
        result.push(playlist);
    }
    return res.status(200).json(result);
}

export const addSongToPlaylist = async (req, res) => {
    let playlistSong = await Playlist_song.findOne({
        where: {
            playlistID: req.params.id,
            songID: req.body.songID
        }
    });
    if (playlistSong) return res.status(200).json(playlistSong);

    const t = await sequelize.transaction();
    try {
        playlistSong = await Playlist_song.create(
            {
                playlistID: req.params.id,
                songID: req.body.songID
            }, { transaction: t }
        )
        await t.commit();
    } catch (e) { console.log(e); t.rollback(); return res.status(500).json(); }

    return res.status(200).json(playlistSong)
}

export const createPlaylist = async (req, res) => {
    let playlist = {}
    const t = await sequelize.transaction();
    try {
        playlist = await Playlist.create({
            name: req.body.name,
            type: req.body.type,
            userID: req.user.userID
        }, { transaction: t });
        await t.commit();
    } catch (e) {
        console.log(e);
        await t.rollback();
        return res.status(400).json();
    }
    return res.status(200).json(playlist)
}