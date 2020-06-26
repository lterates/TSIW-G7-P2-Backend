module.exports = app => {
    const reservation = require("../controllers/reservation.js")

    app.get('/reservations/:idReservation', reservation.findById)

    app.get('/restaurants/:idRestaurant/reservations', reservation.findByRestaurant)

    app.get('/users/:idUser/reservations', reservation.findByUser)

    app.post('/tables/:idTable/users/:idUser/reservations', reservation.create)

    app.put('/reservations/:idReservation/confirm', reservation.confirm)

    app.delete('/reservations/:idReservation', reservation.deleteById)

    app.delete('/restaurants/:idRestaurant/reservations', reservation.deleteByRestaurant)
}