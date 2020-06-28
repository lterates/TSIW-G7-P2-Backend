const Reservation = require("../models/reservation.js")
const db = require("../config/db.js")

exports.findById = (req, res) => {

    const idReservation = req.params.idReservation

    Reservation.findById(idReservation, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `A reserva não foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(200).send({
                "success": [data]
            })
        }
    })
}

exports.findByRestaurant = (req, res) => {

    const idRestaurant = req.params.idRestaurant

    Reservation.findByRestaurant(idRestaurant, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhuma reserva foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(200).send({
                "success": [data]
            })
        }
    })
}

exports.findByUser = (req, res) => {

    const idUser = req.params.idUser

    Reservation.findByUser(idUser, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhuma reserva foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(200).send({
                "success": [data]
            })
        }
    })
}

exports.create = (req, res) => {
    if (!req.body) {
        req.status(400).send({
            message: "Por favor preencha os requisitos"
        })
    } else {
        const idClient = req.params.idUser
        const idTable = req.params.idTable
        const time = req.body.time
        const name = db.con.escape(req.body.name)
        const n_people = req.body.n_people

        const reservation = new Reservation({
            idClient: idClient,
            idTable: idTable,
            time: time,
            name: name,
            n_people: n_people,
        })

        Reservation.create(reservation, (err, data) => {
            if (err) {
                console.log("error catched")
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            } else {
                console.log("Sucesso na criação da reserva")
                res.status(201).send({
                    "success": "Reserva Criada!"
                })
            }
        })
    }
}

exports.confirm = (req, res) => {

    const idReservation = req.params.idReservation
    const status = req.body.status

    Reservation.confirm(status, idReservation, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhuma reserva foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {

            res.status(200).send({
                "Success": "A reserva foi confirmada"
            })
        }
    })
}

exports.deleteById = (req, res) => {

    const idReservation = req.params.idReservation

    Reservation.deleteById(idReservation, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhuma reserva foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(204).send()
        }
    })
}

exports.deleteByRestaurant = (req, res) => {

    const idRestaurant = req.params.idRestaurant

    Reservation.deleteByRestaurant(idRestaurant, (err, data) => {
        if (err) {

            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhuma reserva foi encontrada`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(204).send()
        }
    })
}