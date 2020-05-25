const db = require("../config/db.js")

const User = function (user){
    this.username = user.username
    this.email = user.email
    this.contacto = user.contact
    this.password = user.password
    this.userType = user.userType
    this.ativo = user.active
}

User.findById = (idUser,result) =>{
    db.con.query("SELECT username, email, contacto, foto, password,userType,idRestaurante FROM User WHERE idUser = ? AND ativo = 1",
    idUser,(err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }
        else if(!res[0]){
           return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

User.findAll = (result) =>{
    db.con.query("SELECT idUser, username,email,contacto,foto,password,dieta,userType,idRestaurante FROM User WHERE ativo = 1",
    (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }
        else if(!res[0]){
           return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }  
    })
}
User.getLastId = (result) =>{
    db.con.query("SELECT MAX(idUser) as idUser FROM User",(err,res)=>{

        if(err){
            console.log("error:",err)
            return result(err,null)
        }if(!res[0]){

            return result({kind:"not_found"},null)

        }else{
            return result(null,res)
        }
    })
  
}
User.signUp = (newUser,result)=>{
    db.con.query("INSERT INTO User SET ?", newUser,(err,res)=>{
        if (err) {
            console.log("error:", err)
            return result(err, null)

        } else {
            console.log("user criado")
            return result(null,res)
        }
    })
}

User.confirm = (idUser,result)=>{
    db.con.query("UPDATE User SET ativo = 1 WHERE idUser = ?",idUser,(err,res)=>{
        if(err){
            console.log("error:", err)
            return result(err,null)
        }else if(res.affectedRows == 0){

            return result({kind:"not_found"},null)
        }else{
            return result(null,res)
        }
    })
}

User.update = (user,idUser,result)=>{
    db.con.query("UPDATE User SET contacto = ?, photo = ? , dieta = ?  WHERE idUser = ? AND ativo = 1",
    [user.contact,user.photo, user.diet,idUser],(err,res)=>{
        if(err){

            console.log("error:", err)
            return result(err,null)

        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)

        }else{
            return result(null,res)
        }
    })
}

User.updatePassword = (idUser,newPassword,result)=>{
    db.con.query("UPDATE User SET password = ? WHERE idUser = ? AND ativo = 1", [newPassword,idUser],(err,res)=>{
        if(err){

            console.log("error:", err)
            return result(err,null)

        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)

        }else{
            return result(null,res)
        }
    })
}

module.exports = User