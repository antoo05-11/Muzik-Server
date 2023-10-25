module.exports = (sequelize, DataTypes) => {

    const Playlist = sequelize.define("playlists", {
        dateAdded: {
            type: DataTypes.DATETIME
        }, 
        playlistID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Playlist
}