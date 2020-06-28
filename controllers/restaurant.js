const Restaurant = require("../models/restaurant.js")
const db = require("../config/db.js")
const path = require('path')

exports.getAll = (req, res) => {
    Restaurant.getAll((err, data) => {

        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "Nenhum restaurante encontrado"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.status(200).send({
                "success": [data]
            })
        }
    })

}

exports.findById = (req, res) => {

    const id_restaurante = req.params.id_restaurante

    Restaurant.findById(id_restaurante, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "Nenhum restaurante encontrado"
                })
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

    const name = req.body.name;
    const description = req.body.description;
    const foto = req.body.foto;
    const address = req.body.address
    const zipCode = req.body.zipCode;
    

    
    if (!req.body) {
        res.status(400).send({
            message: "Content Cannot be empty!"
        })
    } else {
        //Create Restaurant
        const restaurant = new Restaurant({          
            name: name,
            description: description,
            foto: foto,
            address: address,
            zipCode: zipCode,
            active: 0
        })

        //Save Restaurant in the database
        Restaurant.create(restaurant, (err, data) => {
            if (err) {
                console.log("error catched")
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            } else {
                console.log("Sucesso na criação do restaurante")

                Restaurant.getLastId((err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            id_restaurante = 0
                        } else {                            
                            console.log("Erro: ", err.emssage)
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                    } else {
                        console.log("aa")
                        const lastIdRestaurant = data.id_restaurante

                        res.status(201).send({
                            "success": lastIdRestaurant
                        })
                    }
                })

            }


        })
    }
}

exports.confirm = (req, res) => {
    const id_restaurante = req.params.id_restaurante

    Restaurant.confirm(id_restaurante, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "Restaurante não foi encontrado"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({
                "success": "Restaurante confirmado com sucesso"
            })
        }
    })
}


exports.delete = (req, res) => {

    const id_restaurante = req.params.id_restaurante

    Restaurant.delete(id_restaurante, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "Restaurante não foi encontrado"
                })
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