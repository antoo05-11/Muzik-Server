module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("users", {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        id: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    })

    return User;
}