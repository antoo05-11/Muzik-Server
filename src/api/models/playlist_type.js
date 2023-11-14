module.exports = (sequelize, DataTypes) => {
    const Playlist_type = sequelize.define("playlist_type", {
        type: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Playlist_type
}