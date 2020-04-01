var mysql = require('mysql');

var config = require('../config.json');

// création d'un pool de connexion à la base de données avec les informations indiquées dans le fichier de configuration
var pool = mysql.createPool({
    connectionLimit: config.connectionLimit,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
});


module.exports = pool