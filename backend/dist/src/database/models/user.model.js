"use strict";
var { Model, DataTypes } = require('sequelize');
class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            username: { type: DataTypes.STRING, unique: true },
            password: DataTypes.STRING,
            accountId: {
                type: DataTypes.INTEGER,
                foreignKey: true,
            },
        }, {
            sequelize,
            timestamps: false,
            tableName: 'users',
        });
    }
}
module.exports = User;
