const db = require('../models')

const Song = db.songs;
export const getSong = async (req, res) => {
    await Song.findAll({
        songID: 1
    }).then(result => {
        res.json(result);
    })
}