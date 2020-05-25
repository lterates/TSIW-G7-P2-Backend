const mysql = require("mysql");


module.exports={
    mysql,
    con: mysql.createConnection({
        host:"sql7.freemysqlhosting.net:3306",
        user: "sql7343069",
        password: "Kaz1ec7cZR", 
        database: `sql7343069`
    })
}