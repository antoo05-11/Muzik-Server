module.exports = (sequelize, DataTypes) => {
    const Playlist = sequelize.define("playlists", {
        playlistID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING
        },
        userID: {
            type: DataTypes.INTEGER
        },
        imageURL: {
            type: DataTypes.STRING
        }
    }, {
        id: false
    })

    return Playlist
}