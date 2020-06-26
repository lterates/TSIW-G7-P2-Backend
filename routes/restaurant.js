module.exports = app => {

    const restaurants = require("../controllers/restaurant.js")

    app.get('/restaurants', restaurants.getAll)

    app.get('/restaurants/:idRestaurant', restaurants.findById)

    app.post('/restaurants', restaurants.create)

    app.delete('/restaurants/:idRestaurant', restaurants.delete)

}