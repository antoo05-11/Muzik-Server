module.exports = (sequelize, DataTypes) => {

    const songViews = sequelize.define("song_views", {
        songID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        date: {
            type: DataTypes.date
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