import path from 'path';
import { fileServerURL } from './song';

const db = require('../models');
const Artist = db.artists;
const Song = db.songs;
const Album = db.albums;

Song.belongsTo(Artist, { foreignKey: 'artistID' });

export const getYourArtists = async (req, res) => {
    const artists = await Artist.findAll();
    let result = [];
    for (const artist of artists) {
        let clone = { ...artist.get() };
        clone.imageURL = fileServerURL + artist.imageURL;
        result.push(clone);
    }
    return res.status(200).json(result);
}

export const getArtistInfo = async (req, res) => {
    const songs = await Song.findAll({
        where: { artistID: req.params.id },
        attributes: ['songID', 'name', 'imageURL', 'songURL', 'duration']
    });

    let result = [];
    for (const song of songs) {
        let clone = { ...song.get() };
        clone.imageURL = fileServerURL + song.imageURL;
        clone.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../../../song/stream/' + clone.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));
        result.push(clone);
    }

    return res.status(200).json(result);
}

export const getArtistAlbums = async (req, res) => {
    const albums = await Album.findAll({ where: { artistID: req.params.id } });
    let result = [];
    for (const album of albums) {
        let clone = { ...album.get() };
        delete clone.artistID;
        clone.imageURL = fileServerURL + album.imageURL;
        result.push(clone);
    }
    return res.status(200).json(result);
}