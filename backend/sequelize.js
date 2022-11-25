// "use strict";
const dotenv = require ('dotenv');
dotenv.config();

module.exports = {
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database:process.env.POSTGRES_DB || 'ng-cash-db',
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: process.env.POSTGRES_DIALECT || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
};
