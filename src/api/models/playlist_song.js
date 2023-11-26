module.exports = (sequelize, DataTypes) => {
    const Playlist_songs = sequelize.define("playlist_song", {
        playlistID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Playlist',
                key: 'playlistID'
            }
        },
        songID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        dateAdded: {
            type: DataTypes.DATE
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Playlist_songs
}