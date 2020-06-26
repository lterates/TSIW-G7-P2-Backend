const mysql = require("mysql");

module.exports={
    mysql,
    con: mysql.createConnection({
        host:"localhost:3306",
        user: "root",
        password: "toma1502", 
        database: `is2go`
    })
}