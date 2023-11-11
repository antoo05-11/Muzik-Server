import { convert } from '../../utils/mp3tohlschunks.js';

const db = require('../models')
var request = require('request');
const Crypto = require('node-crypt');
const fs = require('fs');
const path = require('path');


export const Song = db.songs;

const fileServerURL = 'https://muzik-files-server.000webhostapp.com/';

require('module-alias/register');
const ftp = require("basic-ftp");
const ftpConfig = require('@secret/ftpconfig.js');
const client = new ftp.Client();
client.ftp.verbose = true

export const getSongInfo = async (req, res) => {
    Song.findOne({
        where: { songID: req.params.id }
    }).then(result => {
        //encrypt(result.dataValues.songID, result.dataValues.songName);
        const filteredResult = {
            songID: result.dataValues.songID,
            name: result.dataValues.name,
            imageURL: fileServerURL + result.dataValues.imageURL,
            artistName: "",
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
    let song = await Song.findOne({
        where: { songID: req.params.id }
    });

    const songsConvertedFilePath = path.join(__dirname, '../../songsConverted.data');

    let existingSongs = [];
    try {
        const data = await fs.promises.readFile(songsConvertedFilePath, 'utf-8');
        existingSongs = data.split(',').map(song => song.trim());
    } catch (readFileError) {
        console.log("Init file reader 1: " + readFileError);
    }


    if (!existingSongs.includes(song.dataValues.songURL.toString().replaceAll('song_files/', ''))) {
        try {
            await client.access({
                host: ftpConfig.FTP_HOST,
                user: ftpConfig.FTP_USER,
                password: ftpConfig.FTP_PASSWORD,
                sercure: true
            })
        } catch (err) {
            console.log(err);
        }

        const remoteFilePath = '/public_html/' + song.dataValues.songURL;
        const localFilePath = path.join(__dirname, '../../') + 'songs/' + song.dataValues.songURL.toString().replaceAll('song_files/', '');
        console.log(localFilePath);
        await client.downloadTo(localFilePath, remoteFilePath);
        await convert(existingSongs);
    }
    res.redirect(302, song.dataValues.songURL.toString().replaceAll('song_files/', '').replaceAll('.mp3', '') + '.m3u8');
}

export const downloadChunk = async (request, response) => {
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