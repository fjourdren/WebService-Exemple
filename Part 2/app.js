var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var log4js = require("log4js");
log4js.configure('./config-log4js.json');

var config = require('./config.json');


var tacheRouter = require('./routes/tacheRouter');
var tagRouter = require('./routes/tagRouter');
var statutRouter = require('./routes/statutRouter');


var app = express();

// init HTTP logger
var log = log4js.getLogger("app");
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));


// parse des informations passé dans la requète http
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


// enable cors
app.use(cors())


// setup des routeurs
app.use('/taches', tacheRouter);
app.use('/tags', tagRouter);
app.use('/statuts', statutRouter);


// erreur 404
app.get('*', function(req, res){
  log.warn("Access 404");
  res.status(404).send('<h1>404</h1>');
});


// démarage du serveur
app.listen(config.port, function() {
  log.info('Application démarré sur le port ' + config.port);
});


module.exports = app;