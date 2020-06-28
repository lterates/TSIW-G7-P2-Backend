module.exports = app => {
    const reservation = require("../controllers/reservation.js")

    app.get('/reservations/:id_reservation', reservation.findById)

    app.get('/restaurants/:id_restaurante/reservations', reservation.findByRestaurant)

    app.get('/users/:idUser/reservations', reservation.findByUser)

    app.post('/tables/:idTable/users/:id_utilizador/reservations', reservation.create)

    app.put('/reservations/:id_reservation/confirm', reservation.confirm)

    app.delete('/reservations/:id_reservation', reservation.deleteById)

    app.delete('/restaurants/:id_restaurante/reservations', reservation.deleteByRestaurant)
}