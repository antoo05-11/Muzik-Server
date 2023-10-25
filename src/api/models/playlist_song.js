module.exports = (sequelize, DataTypes) => {

    const Playlist_song = sequelize.define("playlist_song", {
        playlistID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        songID: {
            type: DataTypes.INTEGER
        },
        dateAdded: {
            type: DataTypes.DATETIME
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Playlist
}