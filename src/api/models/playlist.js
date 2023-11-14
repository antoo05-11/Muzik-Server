module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define("playlists", {
        dateAdded: {
            type: DataTypes.DATE
        },
        playlistID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        userID: {
            type: DataTypes.INTEGER
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Playlist
}