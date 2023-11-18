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