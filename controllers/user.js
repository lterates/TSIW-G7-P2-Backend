const User = require('../models/user.js');
const Restaurant = require('../models/restaurant.js')
const bcrypt = require("bcrypt");
var config = require('../config');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')
const db = require("../config/db.js")


exports.findById = (req, res) => {

    const id_utilizador = req.params.id_utilizador

    User.findById(id_utilizador, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "User não foi encontrado"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({
                "success": data
            })
        }
    })
}

exports.findAll = (req, res) => {

    User.findAll((err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not found": "Nenhum User foi encontrado"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({
                "success": data
            })
        }
    })
}

function sendSignUpMail(res, email) {

    let id_utilizador = 0

    User.getLastId((err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                id_utilizador = 0
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {

            id_utilizador = data[0].id_utilizador
            console.log(id_utilizador)
            // If no errors or conflicts are encountered:
            var token = jwt.sign({
                id: id_utilizador
            }, config.secret, {
                expiresIn: new Date().getTime() + 10 * 60 * 1000 // expires in 10 min
            });

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'is2goesmad@gmail.com',
                    pass: 'osrecursos.'
                }
            })

            var mailOptions = {
                from: 'is2goesmad@gmail.com',
                to: email,
                subject: "Registo is2go",
                html: '<h1>Por favor confirme a sua conta no link abaixo!</h1><a href="http://localhost:3000/confirm/' + token + '"><H2>Clique aqui!</H2></a>'
            }

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                } else {
                    console.log('Message sent: ' + info.response);
                    return res.status(201).send({
                        "success": "Registo feito! Por favor verifique o seu email para confirmar a sua conta."
                    });
                }
            })

        }
    })
}


exports.signUp = (req, res) => {

    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty"
        })
    } else {
        const username = req.body.username
        const email = req.body.email
        const num_tel = req.body.num_tel
        const password = req.body.password
        const administrador = req.body.administrador

        User.findAll((err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    bcrypt.hash(password, 10).then(function (hash) {
                        const user = new User({
                            username: username,
                            email: email,
                            num_tel: num_tel,
                            password: hash,
                            administrador: administrador,
                            aprovado: 0,
                            ativo: 0
                        })

                        User.signUp(user, (err, data) => {
                            if (err) {
                                return res.status(500).send({
                                    message: err.message || "Ocorreu um erro"
                                })
                            } else {
                                sendSignUpMail(email)
                                User.getLastId((err, data) => {
                                    if (err) {

                                        if (err.kind === "not_found") {
                                            id_utilizador = 0
                                        } else {
                                            console.log("Erro: ", err.message)
                                        }

                                    } else {

                                        const lastUserId = data[0].id_utilizador

                                        return res.status(201).send({
                                            "success": lastUserId
                                        })

                                    }
                                })

                            }

                        })

                    })

                } else {
                    return res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }

            } else {

                let conflict = false
                //Checks if there's a conflicting email or username
                data.find((data) => {

                    if (data.email === email || data.username === username) {
                        conflict = true
                        return
                    }
                })
                console.log(conflict)


                if (conflict == false) {
                    bcrypt.hash(password, 10).then(function (hash) {
                        const user = new User({
                            username: username,
                            email: email,
                            num_tel: num_tel,
                            password: hash,
                            administrador: administrador,
                            aprovado: 0,
                            ativo: 0
                        })

                        User.signUp(user, (err, data) => {
                            if (err) {
                                return res.status(500).send({
                                    message: err.message || "Ocorreu um erro"
                                })
                            }
                            /* 
                            else if (!err){
                               
                                // create a token
                                var token = jwt.sign({id:data[0].id_utilizador}, config.secret, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                return res.status(200).send({ auth: true, token: token });
                            }
                            */
                            else {

                                sendSignUpMail(email)
                                User.getLastId((err, data) => {
                                    if (err) {

                                        if (err.kind === "not_found") {
                                            id_utilizador = 0
                                        } else {
                                            console.log("Erro: ", err.message)
                                        }

                                    } else {

                                        const lastUserId = data[0].id_utilizador

                                        return res.status(201).send({
                                            "success": lastUserId
                                        })

                                    }
                                })
                            }

                        })
                    })

                } else {
                    return res.status(409).send({
                        "conflict": "O nome do utilizador ou email já está a ser utilizado, por favor escolha outro."
                    })
                }



            }





        })
    }
}


exports.verifyToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({
            auth: false,
            message: 'No token provided.'
        });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        // if everything good, save to request for use in other routes
        req.id_utilizador = decoded.id;
        next();
    });
}



exports.confirm = (req, res) => {

    var token = req.params.token

    var data = jwt.decode(token, config.secret);

    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if (new Date(data.exp) > new Date()) {

        console.log("user found");

        User.confirm(data.id, (err, result) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        "not found": "O utilizador não foi encontrado"
                    })
                } else {
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
            } else {
                User.findById(data.id, (err, result) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                "not found": "O utilizador não foi encontrado"
                            })
                        } else {
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                    } else {

                        let username = result[0].username
                        let id_restaurante = result[0].id_restaurante

                        if (id_restaurante != null) {
                            Restaurant.confirm(result[0].id_restaurante, (err, result) => {
                                if (err) {
                                    if (err.kind === "not_found") {
                                        res.status(404).send({
                                            "not found": "O utilizador não foi encontrado"
                                        })
                                    } else {
                                        res.status(500).send({
                                            message: err.message || "Ocorreu um erro"
                                        })
                                    }
                                } else {
                                    res.status(200).render('badjoras.html', {
                                        name: username
                                    })
                                }
                            })
                        } else {
                            res.status(200).render('badjoras.html', {
                                name: username
                            })
                        }

                    }
                })

            }
        })

    } else {
        console.log("Link is expired");
        res.status(401).send({
            "Expired": "O token passou o prazo de validade"
        })
    }
}

exports.login = (req, res) => {

    const username = req.body.username
    const password = req.body.password


    User.findAll((err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "not found": "Nenhum utilizador foi encontrado"
                })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {

            let found = false
            let id_utilizadorData = 0
            let errorMessage = ""
            let administradorData = ""
            let usernameData = ""
            let emaiData = ""
            let num_telData = 0
            let id_restauranteData = 0
            data.find((data) => {

                if (data.username == username && bcrypt.compareSync(password, data.password)) {

                    id_utilizadorData = data.id_utilizador
                    administradorData = data.administrador
                    usernameData = data.username
                    emaiData = data.email
                    num_telData = data.num_tel
                    fotoData = data.foto
                    id_restauranteData = data.id_restaurante


                    found = true

                }
            })

            if (found == true) {
                var token = jwt.sign({
                    id: data.id_utilizador
                }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });


                res.status(201).send({
                    auth: true,
                    token: token,
                    id_utilizador: id_utilizadorData,
                    username: usernameData,
                    email: emaiData,
                    foto: fotoData,
                    num_tel: num_telData,
                    id_restaurante: id_restauranteData,
                    administrador: administradorData
                });
            } else {
                res.status(401).send({
                    auth: false,
                    token: null,
                    message: "As credenciais são inválidas"
                });
            }
        }
    })

}