module.exports = (sequelize, DataTypes) => {

    const songViews = sequelize.define("song_views", {
        songID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Song',
                key: 'songID'
            }
        },
        date: {
            type: Date
        },
        views: {
            type: DataTypes.INTEGER
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return songViews
}