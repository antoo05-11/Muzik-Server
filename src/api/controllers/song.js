const db = require('../models')
var request = require('request');
const Crypto = require('node-crypt');

const Song = db.songs;

const fileServerURL = 'https://muzik-files-server.000webhostapp.com/';

export const getSongInfo = async (req, res) => {
    Song.findOne({
        where: { songID: req.params.id }
    }).then(result => {
        //encrypt(result.dataValues.songID, result.dataValues.songName);
        const filteredResult = {
            songID: result.dataValues.songID,
            name: result.dataValues.name,
            imageURL: fileServerURL + result.dataValues.imageURL,
            artistName:  "",
            artistID: ""
        };
        res.json(filteredResult);
    })
}

function encrypt(songID, songName) {
    const crypto = new Crypto({
        key: 'b95d8cb128734ff8821ea634dc34334535afe438524a782152d11a5248e71b01',
        hmacKey: 'dcf8cd2a90b1856c74a9f914abbb5f467c38252b611b138d8eedbe2abb4434fc'
    });
    const specialCrypt = 'muzikUETK66'

    let encryptedValue = crypto.encrypt(songID.toString() + songName);
    encryptedValue = encryptedValue.toString().replaceAll('|', specialCrypt);
    console.log(encryptedValue);
}

export const streamSong = async (req, res) => {
    Song.findOne({
        where: { songID: req.params.id }
    }).then((result) => {
        const fullURL = fileServerURL + result.dataValues.songURL;
        request.get(fullURL).pipe(res, function (error) {
            console.log(error);
        });
    });
}

export const downloadSong = async (req, res) => {
    res.json({});
}

export const uploadSong = async (req, res) => {

}