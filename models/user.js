const db = require("../config/db.js")

const User = function (user) {
    this.username = user.username
    this.email = user.email
    this.contacto = user.contact
    this.password = user.password
    this.administrador = user.admin
    this.aprovado = user.aproved
    this.ativo = user.active
}

User.findById = (id_utilizador, result) => {
    db.con.query("SELECT username, email, foto, administrador FROM user WHERE id_utilizador = ? AND ativo = 1",
        id_utilizador, (err, res) => {
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
    db.con.query("SELECT id_utilizador, username, email, foto, password, administrador FROM user WHERE ativo = 1",
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
    db.con.query("SELECT MAX(id_utilizador) as id_utilizador FROM User", (err, res) => {

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

User.confirm = (id_utilizador, result) => {
    db.con.query("UPDATE User SET aprovado = 1 WHERE id_utilizador = ?", id_utilizador, (err, res) => {
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