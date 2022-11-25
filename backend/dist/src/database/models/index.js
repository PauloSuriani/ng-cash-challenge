const Sequelize = require ('sequelize');
const config = require ('../../sequelize');

const User = require('../models/user.model');
const Account = require('../models/account.model');
const Transaction = require('../models/transaction.model');

const connection = new Sequelize(config);

User.init(connection);
Account.init(connection);
Transaction.init(connection);

module.exports = connection;
