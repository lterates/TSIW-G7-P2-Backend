const db = require("../config/db.js")

const Reservation = function (reservation) {
    this.idCliente = reservation.idClient
    this.idMesa = reservation.idTable
    this.horario = reservation.time
    this.nome = reservation.name
    this.n_pessoas = reservation.n_people
}



Reservation.findById = (idReservation, result) => {
    db.con.query("SELECT * FROM Reserva WHERE idReserva = ? AND ativo = 1", idReservation, (err, res) => {
        if (err) {
            console.log("error:", err)
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

Reservation.findByRestaurant = (idRestaurant, result) => {
    db.con.query("SELECT Reserva.* FROM Reserva INNER JOIN Mesa ON Reserva.idMesa = Mesa.idMesa WHERE Mesa.idRestaurante = ? AND Mesa.ativo = 1 AND Reserva.ativo = 1 GROUP BY Reserva.idReserva",
        idRestaurant, (err, res) => {
            if (err) {
                console.log("error:", err)
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

Reservation.findByUser = (idUser, result) => {
    db.con.query("SELECT * FROM Reserva WHERE idCliente = ? AND ativo = 1", idUser, (err, res) => {
        if (err) {
            console.log("error:", err)
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

Reservation.create = (newReservation, result) => {
    db.con.query("INSERT INTO Reserva SET ?", newReservation, (err, res) => {
        if (err) {
            console.log("error:", err)
            return result(err, null)
        } else {
            return result(null, res)
        }
    })
}

Reservation.confirm = (status, idReservation, result) => {
    db.con.query("UPDATE Reserva SET confirmado = ? WHERE idReserva = ? AND ativo = 1", status, idReservation, (err, res) => {
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

Reservation.deleteById = (idReservation, result) => {
    db.con.query("UPDATE Reserva SET ativo = 0 WHERE idReserva = ?", idReservation, result, (err, res) => {
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

Reservation.deleteByRestaurant = (idRestaurant, result) => {
    db.con.query("UPDATE Reserva INNER JOIN Mesa ON Reserva.idMesa = Mesa.idMesa SET Reserva.ativo = 0 WHERE Mesa.idRestaurante = ?",
        idRestaurant, (err, res) => {
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


module.exports = Reservation