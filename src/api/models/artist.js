module.exports = (sequelize, DataTypes) => {

    const Artist = sequelize.define("artists", {
        name: {
            type: DataTypes.STRING
        },
        imageURL: {
            type: DataTypes.STRING
        }, 
        artistID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return Artist
}