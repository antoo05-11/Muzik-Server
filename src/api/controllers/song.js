import { convert } from '../../utils/mp3tohlschunks.js';

const db = require('../models')
const Crypto = require('node-crypt');
const fs = require('fs');
const path = require('path');
const ID3 = require('node-id3');
const moment = require('moment')

export const Song = db.songs;
const Artist = db.artists;
const SongView = db.song_views;
Song.belongsTo(Artist, { foreignKey: 'artistID' });
SongView.belongsTo(Song, { foreignKey: 'songID', as: 'songViews' });

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
                try {
                    await client.downloadTo(localFilePath, remoteFilePath);
                } catch (err) {
                    console.log(err)
                }
                await convert(existingSongs);
            }
        }
    });
} catch (readFileError) {
    console.log("Init file reader: " + readFileError);
}

export const getSongInfo = async (req, res) => {
    let song;

    if (req.query.youtube) {
        let response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
            params: {
                id: req.params.id,
                part: 'contentDetails',
                key: process.env.YOUTUBE_API_KEY
            }
        });
        response = response.data;
        let songURL = await getSongURLFromYoutube(req.params.id);
        song = {
            songID: req.params.id,
            duration: moment.duration(response.items[0].contentDetails.duration).asMilliseconds(),
            songURL: songURL
        }
        return res.status(200).json(song);
    }

    song = await Song.findOne({
        where: { songID: req.params.id }
    });
    let artist = await Artist.findOne({
        where: { artistID: song.artistID }
    });

    const filteredResult = {
        songID: song.dataValues.songID,
        name: song.dataValues.name,
        imageURL: fileServerURL + song.dataValues.imageURL,
        artistName: artist.dataValues.name,
        artistID: song.dataValues.artistID,
        duration: song.dataValues.duration,
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

export const streamSong = async (request, response) => {
    if (request.params.file.includes('.m3u8')) {
        //console.log('request starting...');
    }
    else {
        //console.log('request continues...');
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

export const chartSongs = async (req, res) => {
    const songs = await Song.findAll({
        order: [
            ['views', 'DESC']
        ],
        limit: 10
    })
    let result = [];
    for (const song of songs) {
        let songViews = await SongView.findAll({
            where: { songID: song.songID },
            limit: 10,
            order: [
                ['date', 'DESC']
            ]
        });
        result.push({
            song: song,
            songViews: songViews
        });
    }
    return res.json(result);
}

const ytdl = require("ytdl-core");

async function getSongURLFromYoutube(videoUrl) {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
    const urlList = []
    audioFormats.map((item) => {
        urlList.push(item.url);
    });
    return urlList[0];
}

import axios from 'axios';

export const suggestSearch = async (req, res) => {
    let result;
    try {
        let response = await axios.get(
            'https://suggestqueries.google.com/complete/search',
            {
                headers: {
                    'Accept-Encoding': 'application/json',
                },
                params: {
                    client: "firefox",
                    ds: "yt",
                    q: req.query.q,
                    gl: "us"
                }
            }
        );

        response = response.data;
        result = response[1];

    } catch (error) {
        console.error(error);
        return res.status(404);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).json(result);
}

export const search = async (req, res) => {
    let result;
    if (req.query.youtube) {
        try {
            let response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 10,
                    q: req.query.searchText,
                    type: 'video',
                    key: process.env.YOUTUBE_API_KEY
                }
            });
            response = response.data;
            result = response;
            result = {
                nextPageToken: response.nextPageToken
            };
            result.songs = [];
            for (let song of response.items) {
                song = {
                    songID: song.id.videoId,
                    name: song.snippet.title,
                    imageURL: song.snippet.thumbnails.medium.url,
                    artistName: song.snippet.channelTitle
                }
                result.songs.push(song);
            }
        } catch (error) {
            console.error(error);
            return res.status(404);
        }
    }
    return res.status(200).json(result);
}