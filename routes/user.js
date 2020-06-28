module.exports = app => {

  const user = require("../controllers/user.js");

  app.get('/users/:id_utilizador', user.findById);

  app.get('/users', user.findAll);

  app.get('/confirm/:token', user.confirm);

  app.post('/login', user.login);

  app.post('/signUp', user.signUp);

  //app.delete('/users/:idUser',user.delete);

}