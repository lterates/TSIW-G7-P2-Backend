const db = require("../config/db.js")

const User = function (user) {
    this.username = user.username
    this.email = user.email
    this.contacto = user.contact
    this.password = user.password
    this.administrador = user.admin
    this.aprovado = user.aproved
}

User.findById = (idUser, result) => {
    db.con.query("SELECT username, email, contacto, password,administrador, idRestaurante FROM User WHERE idUser = ? AND aprovado = 1",
        idUser, (err, res) => {
            if (err) {
                console.log("Error:", err)
                return result(err, null)
            } else if (!res[0]) {
                return result({
                    kind: "not_found"
                }, null)
            } else {
                return result(null, res)
            }
        })
}


User.findAll = (result) => {
    db.con.query("SELECT idUser, username,email,contacto,avatar,password,administrador,idRestaurante FROM User WHERE aprovado = 1",
        (err, res) => {
            if (err) {
                console.log("Error:", err)
                return result(err, null)
            } else if (!res[0]) {
                return result({
                    kind: "not_found"
                }, null)
            } else {
                return result(null, res)
            }
        })
}
User.getLastId = (result) => {
    db.con.query("SELECT MAX(idUser) as idUser FROM User", (err, res) => {

        if (err) {
            console.log("error:", err)
            return result(err, null)
        }
        if (!res[0]) {

            return result({
                kind: "not_found"
            }, null)

        } else {
            return result(null, res)
        }
    })

}
User.signUp = (newUser, result) => {
    db.con.query("INSERT INTO User SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error:", err)
            return result(err, null)

        } else {
            console.log("user criado")
            return result(null, res)
        }
    })
}

User.confirm = (idUser, result) => {
    db.con.query("UPDATE User SET aprovado = 1 WHERE idUser = ?", idUser, (err, res) => {
        if (err) {
            console.log("error:", err)
            return result(err, null)
        } else if (res.affectedRows == 0) {

            return result({
                kind: "not_found"
            }, null)
        } else {
            return result(null, res)
        }
    })
}


module.exports = User