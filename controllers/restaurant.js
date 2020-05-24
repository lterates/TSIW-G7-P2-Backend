const Restaurant = require("../models/restaurant.js")
const db = require("../db")

 exports.getAll = (req,res) =>{
    Restaurant.getAll((err,data)=>{
        
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Nenhum restaurante encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
           
        }else{
            res.setHeader("Content-Type","application/json; charset=utf-8")
            res.status(200).send({"success":[data]})
        }
    })
   
}

exports.findById = (req,res) =>{

    const idRestaurant = req.params.idRestaurant
 
    Restaurant.findById(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Nenhum restaurante encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }else{
           
            res.status(200).send({"success":[data]})
        }
    })
}


exports.create = (req,res) =>{
    
const name = db.con.escape(req.body.name);
const description = db.con.escape(req.body.description);
const foto = db.con.escape(req.body.foto);
// const gpsAddress = db.con.escape(req.body.gpsAddress);
// const gps = db.con.escape(req.body.gps);
const zipCode = req.body.zipCode;

    //Validar pedido
    if(!req.body){
        res.status(400).send({
            message:"Content Cannot be empty!"
        })
    }
    else{
        //Create Restaurant
        const restaurant = new Restaurant ({
            name: name,
            description: description,            
            foto: foto,
            // gpsAddress: gpsAddress,
            // address: gps,
            zipCode: zipCode
        })

        //Save Restaurant in the database
        Restaurant.create(restaurant,(err,data)=>{
            if(err){
                console.log("error catched")
                res.status(500).send({
                    message:err.message || "Ocorreu um erro"
                })
            }
                console.log("Sucesso na criação do restaurante")
                res.status(201).send({"success":"Restaurante Criado com sucesso"})
            
        })
    }
}

exports.update = (req,res) =>{
    //validate request
    if(!req.body){
        res.status(400).send({
            message:"Content Can't be empty!" 
        })
    }else{

        const name = db.con.escape(req.body.name)
        const description = db.con.escape(req.body.description)        
        const foto = req.body.foto
        // const gps = db.con.escape(req.body.gps)
        // const address = db.con.escape(req.body.address)
        const zipCode = req.body.zipCode
        const idRestaurant = req.params.idRestaurant
 
       const restaurant = new Restaurant({
            name: name,
            description: description,           
            foto: foto,
            // gpsAdress: gps,
            // address: address,
            zipCode: zipCode
       })

       Restaurant.update(idRestaurant,restaurant,(err,data)=>{
           if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({"Not found" : "Nenhum restaurante encontrado"})
                }
                else{
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
           }else{
               res.status(200).send({"success": "Restaurante Atualizado com sucesso"})
           }
       })
    }
}

exports.delete = (req,res) =>{
    
    const idRestaurant = req.params.idRestaurant
    
    Restaurant.delete(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Restaurante não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }else{
            res.status(204).send()
        }
    })
}