const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "demo",
    password: "Sahi@2019",
    port: 5432
});

module.exports = pool;