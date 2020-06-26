module.exports = app => {

    const plate = require("../controllers/plate.js")   

    app.get('/plates', plate.getAll)

    app.get('/plates/:idPlate', plate.findById)

    app.get('/restaurants/:idRestaurant/plates' , plate.findByRestaurant) 

    app.post('/restaurants/:idRestaurant/plates', plate.create)

    app.delete("/plates/:idPlate", plate.delete);

    app.delete("/restaurants/:idRestaurant/plates", plate.deleteAll);
}