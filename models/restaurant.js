const db = require("../config/db.js")

//Constructor
const Restaurant = function (restaurant) {
    this.nome = restaurant.name
    this.descrição = restaurant.description   
    this.coverFoto = restaurant.coverFoto
  //  this.gps = restaurant.gps
    this.morada = restaurant.address
    this.Codigo_postal = restaurant.zipCode
    this.ativo = restaurant.active

}
// Gets All restaurants from Database
Restaurant.getAll = result => {

    db.con.query('SELECT * FROM Restaurante WHERE ativo = 1;', function (err, res) {
        if (err) {
            console.log(err)
            result(err, null)
            return
        
        }

        else if(!res[0]){
            result({kind:"not_found"},null)
        }

        else {

            console.log("Restaurants: ", res)
            result(null, res)
            return

        }
    })
}

// Gets ONE Selected Restaurant from Database
Restaurant.findById = (restaurantId, result) => {

    //Send prepared command to Database
    db.con.query("SELECT * FROM Restaurante WHERE idRestaurante = ? AND ativo = 1", restaurantId, (err, res) => {

        // If there's any problem with the data retrieval 
        if (err) {
            console.log("error:", err)
            return result(err, null)
           
        }
        // If there's no restaurant found
        else if (!res[0]) {
            return result({ kind: "not_found" }, null)
            
            
        }
        // If there's the found Restaurant
        else {
            return result(null, res[0])
            
        }
    })

}

Restaurant.getLastId = (result) =>{

    db.con.query("SELECT Max(idRestaurante) as idRestaurante FROM Restaurante",(err,res)=>{
        if(err){
            console.log("error:", err)
            return result(err, null)
        }
        else if(!res[0]){
            return result({ kind: "not_found" }, null)
        }
        else{
            return result(null, res[0])
        }
    })
    
}


Restaurant.create = (newRestaurant, result) => {
    //Preparing to add new restaurant Database
    db.con.query("INSERT INTO Restaurante SET ?", newRestaurant, (err, res) => {
        if (err) {
            console.log("error:", err)
            return result(err, null)

        } else {
            console.log("Restaurante criado")
            return result(null, "Restaurante criado")
        }
    })

    
}


Restaurant.confirm = (id,result) =>{
    db.con.query('UPDATE Restaurant SET ativo = 1 WHERE idRestaurante = ? and ativo = 0',id,(err,res)=>{
        if(err){
            console.log("error:", err);
            return result(err,null)
        }
        //If no row has been affected/changed, an error will occur
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }else{
            return result(null,"Restaurante confirmado")
        }
    })
}

Restaurant.delete = (id,result) =>{
    
            db.con.query("UPDATE Restaurante SET ativo = 0 WHERE idRestaurante = ? AND ativo = 1",id,(err,res)=>{
                if(err){
                    console.log("error:", err);
                   return  result(err,null)
                }
                else if(res.affectedRows == 0){
                   return result({kind:"not_found"},null)
                }
                else{
                    console.log("Restaurante Apagado")
                    return result(null,"Removido com sucesso")
                }
            })
}

module.exports = Restaurant