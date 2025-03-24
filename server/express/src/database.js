const pgPromise = require("pg-promise")({
  // Context
});

const dbConnection = {
    host: 'postgres_db',
    port: 5432,
    database: 'ps_g5',
    user: 'postgres',
    password: '1234',
    max: 30 // use up to 30 connections

    // "types" - in case you want to set custom type parsers on the pool level
};

const db = pgPromise(dbConnection);
module.exports = db;