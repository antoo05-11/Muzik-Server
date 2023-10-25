module.exports = (sequelize, DataTypes) => {

    const Album = sequelize.define("albums", {
        name: {
            type: DataTypes.STRING
        },
        imageURL: {
            type: DataTypes.STRING
        }, 
        albumID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Album
}