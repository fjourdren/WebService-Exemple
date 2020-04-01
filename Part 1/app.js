var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config.json');

var tacheRouter = require('./routes/tacheRouter');



// Ajouter des tâches démo
var listDatabase = require('./listDatabase');
var Tache = require('./models/Tache');

// ajout de tâche demo dans la liste
listDatabase.tachesList.push(new Tache(1, "Tâche 1", "2020-02-01", "2020-02-30"));
listDatabase.tachesList.push(new Tache(2, "Tâche 2", "2020-01-09", "2020-12-30"));
listDatabase.tachesList.push(new Tache(3, "Tâche 3", "2020-03-15", "2020-04-17"));

listDatabase.prochainId = 4;




// init de l'app
var app = express();


// parse des informations passé dans la requète http
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// setup des routeurs
app.use('/taches', tacheRouter);


// erreur 404
app.get('*', function(req, res){
  res.status(404).send('<h1>404</h1>');
});


// démarage du serveur
app.listen(config.port, function () {
  console.log('Application démarré sur le port ' + config.port);
});


module.exports = app;