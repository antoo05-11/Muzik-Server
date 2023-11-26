import { model } from 'mongoose';
import { convert } from '../../utils/mp3tohlschunks.js';

const db = require('../models')
const Crypto = require('node-crypt');
const fs = require('fs');
const path = require('path');
const ID3 = require('node-id3');

export const Song = db.songs;
const Artist = db.artists;
const songViews = db.song_views;
Song.belongsTo(Artist, { foreignKey: 'artistID' });

export const fileServerURL = 'https://muzik-files-server.000webhostapp.com/';
const ftp = require("basic-ftp");
const client = new ftp.Client();
client.ftp.verbose = true

// Load all songs from file server to API server.
let existingSongs = [];
try {
    const songsConvertedFilePath = path.join(__dirname, '../../songsConverted.txt');
    fs.open(songsConvertedFilePath, 'a', function (err, f) {
        console.log('open!');
    });
    fs.promises.readFile(songsConvertedFilePath, 'utf-8').then(data => {
        existingSongs = data.split(',').map(song => song.trim());
    }).then(async () => {
        console.log(existingSongs);
        let songsList = await Song.findAll();
        for (const song of songsList) {
            if (!existingSongs.includes(song.dataValues.songURL.toString().replaceAll('song_files/', ''))) {
                try {
                    await client.access({
                        host: process.env.FTP_HOST,
                        user: process.env.FTP_USER,
                        password: process.env.FTP_PASSWORD,
                        sercure: true
                    })
                } catch (err) {
                    console.log(err);
                }

                const remoteFilePath = '/public_html/' + song.dataValues.songURL;
                const localFilePath = path.join(__dirname, '../../') + 'songs/' + song.dataValues.songURL.toString().replaceAll('song_files/', '');
                await client.downloadTo(localFilePath, remoteFilePath);
                await convert(existingSongs);
            }
        }
    });
} catch (readFileError) {
    console.log("Init file reader: " + readFileError);
}

export const getSongInfo = async (req, res) => {
    let song = await Song.findOne({
        where: { songID: req.params.id }
    });
    let artist = await Artist.findOne({
        where: { artistID: song.artistID }
    });

    //encrypt(result.dataValues.songID, result.dataValues.songName);
    const filteredResult = {
        songID: song.dataValues.songID,
        name: song.dataValues.name,
        imageURL: fileServerURL + song.dataValues.imageURL,
        artistName: artist.dataValues.name,
        artistID: song.dataValues.artistID,
        songURL: path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../../stream/' + song.dataValues.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'))
    };
    res.json(filteredResult);
}

export const getAllSongs = async (req, res) => {
    const songs = await Song.findAll({
        include: [{
            model: Artist,
            attributes: ['name']
        }]
    });
    if (!songs) return res.json(404);

    let result = [];
    for (const song of songs) {
        let clone = { ...song.get() };
        clone.artistName = clone.artist.name;
        delete clone.artist;
        clone.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../stream/' + clone.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));
        clone.imageURL = fileServerURL + clone.imageURL;
        result.push(clone);
    }
    return res.status(200).json(result);
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

export const streamSong = async (request, response) => {
    if (request.params.file.includes('.m3u8')) {
        console.log('request starting...');
    }
    else {
        console.log('request continues...');
    }

    var filePath = './src/temp/chunks/' + request.params.file;

    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
                response.end();
            }
        }
        else {
            response.end(content, 'utf-8');
        }
    });
}

export const downloadSong = async (req, res) => {
    res.json({});
}

export const uploadSong = async (req, res) => {

}

export const getYourTopSongs = async (req, res) => {
    const songs = await Song.findAll({
        include: [{
            model: Artist,
            attributes: ['name']
        }]
    });
    if (!songs) return res.json(404);

    let result = [];
    for (const song of songs) {
        let clone = { ...song.get() };
        clone.artistName = clone.artist.name;
        delete clone.artist;
        clone.songURL = path.join(req.protocol + '://' + req.get('host') + req.originalUrl, '../stream/' + clone.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '.m3u8'));
        clone.imageURL = fileServerURL + clone.imageURL;
        result.push(clone);
    }
    return res.status(200).json(result);
}
songViews.belongsTo(Song, { foreignKey: 'songID' })
export const chartSongs = async (req, res) => {
    const song_views = await songViews.findAll({
        order: [
            ['views', 'DESC']
        ],
        include: {
            model: Song,
        }
    })
    res.json(song_views)
}