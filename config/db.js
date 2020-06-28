const mysql = require("mysql");

module.exports = {
    mysql,
    con: mysql.createConnection({
        host: "localhost",
        port: "3306",
        user: "root",
        password: "toma1502",
        database: `esmad_is2go`
    })
}