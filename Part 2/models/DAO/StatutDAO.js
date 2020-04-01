var log = require('log4js').getLogger("StatutDAO");

var mysqlConnectionPool = require('../../Utils/mysqlConnectionPool');
var filtreToSQL = require('../../Utils/Filtre');

var Statut = require('../Statut');
var Tache = require('../Tache');

class StatutDAO {

    static find(callback) {
        let statutsOutputList = [];

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT * FROM  statut;', function(error, results, fields) {
                
                // On relache la connexion au pool
                connection.release();


                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }


                // reconstruction des objets après la sélection
                for(let i = 0; i < results.length; i++) {
                    statutsOutputList.push(new Statut(results[i].label));
                }


                return callback(true, "Des statuts ont été trouvés.", statutsOutputList);
            });
        });      
    }

    static findByLabel(label, callback) {
        let statutOutput = null;

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT * FROM statut WHERE label=? LIMIT 1;', [label], function(error, results, fields) {

                // On relache la connexion au pool
                connection.release();

                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }

                // reconstruction de l'objet après la sélection
                if(results.length == 0) {
                    return callback(false, "Erreur: Ce statut n'existe pas.", null);
                } else {
                    statutOutput = new Statut(results[0].label);
                    return callback(true, "Un statut a été trouvé.", statutOutput);
                }
            });
        });
    }

    static create(statut, callback) {
        // vérification de la validité d'un statut
        let error = statut.validateFields();
        if(error) {
            return callback(false,  error, null);
        }

        mysqlConnectionPool.query('INSERT INTO statut VALUE (?);', [statut.label], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "Le statut a été inséré.", statut);
            }
        });
    }

    static put(statut, newValues, callback) {
        let oldValue = statut.label;
        statut.label = newValues.label;

        // vérification de la validité d'un statut
        let error = statut.validateFields();
        if(error) {
            return callback(false, error, null);
        }


        mysqlConnectionPool.query('UPDATE statut SET label=? WHERE label = ?;', [statut.label, oldValue], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "Le statut a été mis à jour.", statut);
            }
        });
    }

    static delete(statut, callback) {
        return statutDAO.deleteByLabel(statut.label, callback);
    }

    static deleteByLabel(label, callback) {
        mysqlConnectionPool.query('DELETE FROM statut WHERE label=?;', [label], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                // check si une ligne a été suprimé
                if(results.affectedRows == 0) {
                    return callback(false, "Erreur: Aucune ligne ne correspond à ces informations.", null);
                } else {
                    return callback(true, "Le statut a été supprimé.", ""); // si on est ici => succès de la supression
                }
            }
        });
    }

    static getStatutTaches(statut, filtre, callback) {
        let tachesOutputList = [];

        // gestion du filtrage
        var filtreSQL = filtreToSQL(filtre);

        // génère le sql à partir des éléments reçus par le filtrage
        let sql = 'SELECT tache.* FROM tache WHERE tache.statut=?';
        if(filtreSQL != "") {
            sql += " AND " + filtreSQL;
        }

        // exécution de la requête
        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query(sql, [statut.label], function(error, results, fields) {
                
                // On relache la connexion au pool
                connection.release();

                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }

                // reconstruction des taches après la sélection
                for(let i = 0; i < results.length; i++) {
                    tachesOutputList.push(new Tache(results[i].id, results[i].title, results[i].dateBegin, results[i].dateEnd, results[i].statut));
                }


                return callback(true, "Des tâches associées à ce statut ont été trouvées.", tachesOutputList);
            });
        });
    }
}

module.exports = StatutDAO