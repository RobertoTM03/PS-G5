const pgPromise = require("pg-promise")({
});

const dbConnection = {
    host: 'postgres_db',
    port: 5432,
    database: 'ps_g5',
    user: 'postgres',
    password: '1234',
    max: 30
};

const db = pgPromise(dbConnection);
module.exports = db;