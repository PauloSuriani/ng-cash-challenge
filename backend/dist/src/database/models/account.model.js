"use strict";
var { Model, DataTypes } = require('sequelize');
class Account extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            balance: DataTypes.DECIMAL(10, 2)
        }, {
            sequelize,
            timestamps: false,
            tableName: 'accounts',
        });
    }
}
module.exports = Account;
