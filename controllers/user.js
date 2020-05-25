const User = require('../models/user.js');
const bcrypt = require("bcrypt");
var config = require('../config');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')
const db = require("../config/db.js")


exports.findById = (req,res) =>{

    const idUser = req.params.idUser

    User.findById(idUser,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "User não foi encontrado"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(200).send({"success": [data]})
        }
    })
}

exports.findAll = (req,res) =>{
    User.findById((err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Nenhum User foi encontrado"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(200).send({"success": [data]})
        }
    })
}

function sendSignUpMail(res,email){

    let idUser = 0
            
    User.getLastId((err,data)=>{
        if(err){
            if(err.kind==="not_found"){
                idUser = 0
            }else{
                res.status(500).send({message:err.message || "Ocorreu um erro"})
            }
        }else{

            idUser = data[0].idUser
            console.log(idUser)
            // If no errors or conflicts are encountered:
            var token = jwt.sign({id:idUser}, config.secret, {
                expiresIn: new Date().getTime() +  10 * 60 * 1000 // expires in 10 min
            });

            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'devjohnwink@gmail.com',
                    pass:'googleSiOl920092.'
                }
            })

            var mailOptions = {
                from:'devjohnwink@gmail.com',
                to:email,
                subject:"Registo MealSet",
                html:'<h1>Obrigado registar no MealSet! Por favor confirme a sua conta clicando no link abaixo!</h1><a href="http://localhost:3000/confirm/'+token+'"><H2>Clique aqui!</H2></a>'
            }

            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }else{
                    console.log('Message sent: ' + info.response);
                    return res.status(201).send({"success": "Registo feito! Por favor verifique o seu email para confirmar a sua conta."});
                }
            })
        
        }
    })
}


exports.signUp = (req,res)=>{
    
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }else{
        const username = db.con.escape(req.body.username)
        const email = req.body.email
        const contact = req.body.contact
        const password = req.body.password
        const userType = db.con.escape(req.body.userType)

        

        User.findAll((err,data)=>{
            if (err){
                if(err.kind==="not_found"){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            email: email,
                            contact: contact,
                            password:hash,
                            userType: userType,
                            active:0
                        })
                        
                        User.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                  
                            else{
                                sendSignUpMail(res,email)
                            }
                           
                        })
                        
                    })
                    
                }else{
                    return res.status(500).send({message:err.message ||"Ocorreu um erro"})
                }
                
            }else{
                
                let conflict = false
                //Checks if there's a conflicting email or username
                data.find((data)=>{
                    
                    if(data.email=== email  || data.username === username){
                        conflict = true
                       return 
                    }
                })
                console.log(conflict)
              

                if(conflict == false){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            email: email,
                            contact: contact,
                            password:hash,
                            userType: userType,
                            active:0
                        })
                        
                        User.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                            /* 
                            else if (!err){
                               
                                // create a token
                                var token = jwt.sign({id:data[0].idUser}, config.secret, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                return res.status(200).send({ auth: true, token: token });
                            }
                            */
                     
                           else{
                            sendSignUpMail(res,email)
                           } 
                           
                        })
                    })

                }else{
                    return res.status(409).send({"conflict":"O nome do utilizador ou email já está a ser utilizado"})
                }
                

                
            }
           


            

        })
    }
}




exports.verifyToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
      // if everything good, save to request for use in other routes
      req.idUser = decoded.id;
      next();
    });
}




exports.confirm = (req,res) =>{
    
    var token = req.params.token

    var data = jwt.decode(token,config.secret);
    
    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if(new Date(data.exp)> new Date()){
        
            console.log("user found");

            User.confirm(data.id,(err,result)=>{
                if(err){
                    if(err.kind==="not_found"){
                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                    }
                    else{
                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                    }
                }else{

                    res.status(200).send({"success":"Email foi verificado"})
                }
            })
        
    }else{
        console.log("Link is expired");
        res.status(401).send({"Expired":"O token passou o prazo de validade"})
    }
}

exports.login = (req,res) =>{

    const username = db.con.escape(req.body.username)
    const password = req.body.password

    
        User.findAll((err,data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({"not found": "Nenhum utilizador foi encontrado"})
                }else{
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }
            }else{

                let found = false
                let errorMessage = ""

                data.find((data)=>{
              
                    if(data.username == username && bcrypt.compareSync(password,data.password)){
                        found = true
                      
                    }
                })

              
                if(found == true){
                    var token = jwt.sign({ id: data.idUser }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });

                    res.status(201).send({ auth: true, token: token });
                }else{
                    res.status(401).send({ auth: false, token: null, message:"As credenciais são inválidas" });
                }
            }
        })
      
}


exports.update = (req,res) =>{

    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }
    else{
        const contact = req.body.contact;
        const avatar = req.body.avatar;
        const diet = db.con.escape(req.body.diet);
        const idUser = req.params.idUser

        let user={
            contact:contact,
            avatar: avatar,
            diet: diet
        }
            
        User.update(user,idUser,(err,data)=>{
            if(err){
                if(err.kind === "not_found"){

                    res.status(404).send({"Not found": "User não foi encontrado"})

                }else{

                    res.status(500).send({message:err.message ||"Ocorreu um erro"})

                }
            }
            else{
                res.status(201).send({"success":"Os dados foram atualizados com sucesso"})
            }
        }) 
    }

}

exports.newPassword = (req,res)=>{
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }else{
        const idUser = req.params.idUser
        const password = db.con.escape(req.body.password)
        const newPassword = db.con.escape(req.body.newPassword)
        let email = ""



        User.findAll((err,data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({"not found": "Nenhum utilizador foi encontrado"})
                }else{
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }
            }else{

                let found = false
                let errorMessage = ""

                data.find((data)=>{
              
                    if(data.idUser == idUser && bcrypt.compareSync(password,data.password)){

                        found = true
                        email = data.email
                      
                    }
                })

              
                if(found == true){
                    var token = jwt.sign({id:idUser}, config.secret, {
                        expiresIn: new Date().getTime() + 10 * 60 * 1000 // expires in 10 min
                    });
            
                    var transporter = nodemailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:'devjohnwink@gmail.com',
                            pass:'googleSiOl920092.'
                        }
                    })
            
                    var mailOptions = {
                        from:'devjohnwink@gmail.com',
                        to:email,
                        subject:"Confirmar nova password",
                        html:'<h1>Por favor confirme a sua nova password clicando no link abaixo!</h1><a href="http://localhost:3000/confirm/'+token+'/'+newPassword+'"><H2>Clique aqui!</H2></a>'
                    }
            
                    transporter.sendMail(mailOptions,function(err,info){
                        if(err){
                            console.log(err);
                            res.status(500).send({message:err.message || "Ocorreu um erro"})
                        }else{
                            console.log('Message sent: ' + info.response);
                            return res.status(200).send({"success": "Por favor verifique o seu email para confirmar a sua nova password."});
                        }
                    })
                }else{
                    res.status(401).send({ auth: false, token: null, message:"A password é  inválida" });
                }
            }
        })

       

    }
   
}

exports.passwordUpdate = (req,res) =>{

    const token = req.params.token
    const password = db.con.escape(req.params.password)

    var data = jwt.decode(token,config.secret);

    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if(new Date(data.exp)> new Date()){
        
            console.log("user found");

            User.updatePassword(data.id,password,(err,result)=>{
                if(err){
                    if(err.kind==="not_found"){
                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                    }
                    else{
                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                    }
                }else{
                    res.status(200).send({"success":"A nova password foi introduzida com êxito"})
                }

            })
        
    }else{
        console.log("Link is expired");
        res.status(401).send({"Expired":"O token passou o prazo de validade"})
    }


}