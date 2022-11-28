"use strict";
// "use strict";
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    username: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    database: process.env.PGDATABASE || 'ng-cash-db',
    host: process.env.PGHOST || 'localhost',
    dialect: process.env.POSTGRES_DIALECT || 'postgres',
    port: process.env.PGPORT || 5430,
};
