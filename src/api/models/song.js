module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define("songs", {
        name: {
            type: DataTypes.STRING
        },
        imageURL: {
            type: DataTypes.STRING
        },
        albumID: {
            type: DataTypes.INTEGER
        },
        artistID: {
            type: DataTypes.INTEGER
        },
        songURL: {
            type: DataTypes.STRING
        },
        songID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        duration: {
            type: DataTypes.INTEGER
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Song
}