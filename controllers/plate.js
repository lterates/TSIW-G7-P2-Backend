const Plate = require("../models/plate.js")
const db = require("../config/db.js")

exports.getAll = (req, res) => {
    Plate.getAll((err, data) => {
        //If something goes wrong getting the data from the database: 
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhum prato foi encontrado.`
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


exports.findById = (req, res) => {

    const idPlate = req.params.idPlate

    Plate.findById(idPlate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O prato não foi encontrado.`
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

    Plate.findByRestaurant(idRestaurant, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Os pratos não foram encontrados.`
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

    //Validar pedido
    if (!req.body) {
        res.status(400).send({
            message: "Por favor preencha os requisitos"
        })
    } else {

        const name = db.con.escape(req.body.name)
        const description = db.con.escape(req.body.description)
        const foto = req.body.foto
        const idRestaurant = req.params.idRestaurant

        //Create Plate
        const plate = new Plate({
            name: name,
            description: description,
            foto: foto,
            idRestaurant: idRestaurant
        })

        //Save Plate in the database
        Plate.create(plate, (err, data) => {
            if (err) {
                console.log("error catched")
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            } else {
                Plate.findById((err, data) => {
                    if (err) {
                        console.log("error catched")
                        res.status(500).send({
                            message: err.message || "Ocorreu um erro"
                        })
                    } else {
                        console.log("Sucesso na criação do prato")
                        res.status(201).send({
                            "success": data
                        })
                    }
                })
            }


        })
    }
}

exports.delete = (req, res) => {

    const idPlate = req.params.idPlate

    Plate.delete(idPlate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O prato não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        } else {
            res.status(204).send();
        }
    });
};

exports.deleteAll = (req, res) => {

    const idRestaurant = req.params.idRestaurant

    Plate.deleteAll(req.params.idRestaurant, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O restaurante não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        } else {
            console.log(data)
            res.status(204).send();
        }
    });
}