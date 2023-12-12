module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("users", {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return User;
}