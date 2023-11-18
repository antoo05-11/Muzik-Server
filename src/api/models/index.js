import { DataTypes, Sequelize } from "sequelize";
require('dotenv').config()
const sequelize = new Sequelize(
    process.env.DB_URI, {}
)
sequelize.authenticate().then(() => {
    console.log("connected...");
}).catch(e => { console.log(e); })

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.songs = require('../models/song.js')(sequelize, DataTypes);
db.albums = require('../models/album.js')(sequelize, DataTypes);
db.artists = require('../models/artist.js')(sequelize, DataTypes);
db.playlists = require('../models/playlist.js')(sequelize, DataTypes);
db.playlist_songs = require('../models/playlist_song.js')(sequelize, DataTypes);
db.users = require('../models/user.js')(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })
module.exports = db;
