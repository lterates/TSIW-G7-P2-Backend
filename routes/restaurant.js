module.exports = app => {

    const restaurants = require("../controllers/restaurant.js")

    app.get('/restaurants', restaurants.getAll)

    app.get('/restaurants/:id_restaurante', restaurants.findById)

    app.post('/createRestaurants', restaurants.create)

    app.delete('/restaurants/:id_restaurant', restaurants.delete)

}