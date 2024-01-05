import path from 'path';

const db = require('../models')

const Song = db.songs;
const Album = db.albums;
const Artist = db.artists;

Album.belongsTo(Artist, { foreignKey: 'artistID' });
const fileServerURL = 'https://muzik-files-server.000webhostapp.com/';

export const getAllAlbums = async (req, res) => {
    const albums = await Album.findAll({
        include: {
            model: Artist,
            attribute: ['artistID']
        }
    });
    let result = [];
    for (const album of albums) {
        let clone = { ...album.get() };
        clone.imageURL = fileServerURL + album.imageURL;
        clone.artistName = clone.artist.name;
        delete clone.artist;
        result.push(clone);
    }
    return res.status(200).json(result);
}

export const getAllSongs = async (req, res) => {
    let songsFound = await Song.findAll({
        where: { albumID: req.params.id }, include: {
            model: Artist,
            attributes: ['artistID', 'name']
        }
    });
    let result = [];
    for (let song of songsFound) {
        song = { ...song.get() };
        song.imageURL = fileServerURL + song.imageURL;
        song.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../../../song/stream/' + song.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));
        song.artistID = song.artist.artistID
        song.artistName = song.artist.name
        delete song.artist;
        result.push(song);
    }
    res.json(result);
}

export const getRecentAlbums = async (req, res) => {
    const albums = await Album.findAll({
        include: {
            model: Artist,
            attribute: ['artistID']
        }
    });
    let result = [];
    for (const album of albums) {
        let clone = { ...album.get() };
        clone.imageURL = fileServerURL + album.imageURL;
        clone.artistName = clone.artist.name;
        delete clone.artist;
        result.push(clone);
    }
    return res.status(200).json(result);
}