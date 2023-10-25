const db = require('../models')

const Song = db.songs;
const Album = db.albums;

export const getAllAlbums = async (req, res) => {
    Album.findAll().then((albumsFound) => {
        res.json(albumsFound);
    })
}

const fileServerURL = 'https://muzik-files-server.000webhostapp.com/';

export const getAllSongs = async (req, res) => {
    Album.findOne({ where: { albumID: req.params.id } }).then((albumFound) => {
        Song.findAll({ where: { albumID: req.params.id } })
            .then((songsFound) => {
                albumFound.imageURL = fileServerURL + albumFound.imageURL;
                let filteredResult = [];
                songsFound.forEach(element => {
                    filteredResult.push({
                        songID: element.songID,
                        songName: element.name,
                        songImageURL: fileServerURL + element.songURL,
                        artistName: ""
                    });
                });
                res.json({
                    album: albumFound,
                    songs: filteredResult
                });
            })
    })
}