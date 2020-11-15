const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "",
    database: "repos_db",
    host: "localhost",
    post: 5432
})

module.exports = pool;
