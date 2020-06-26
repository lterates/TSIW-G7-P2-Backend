const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/db.js")

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

module.exports = app;
require("./routes/restaurant.js")(app)
require("./routes/plate.js")(app)
require("./routes/reservation")(app)
require("./routes/user.js")(app)



// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to your application."
  });
});

let port = process.env.PORT

if (port == null || port == "") {
  port = 3000
}
app.listen(port, function () {
  console.log("Server running at port", port)
})

/*
// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

*/