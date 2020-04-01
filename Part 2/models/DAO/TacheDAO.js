var log = require('log4js').getLogger("TacheDAO");

var mysqlConnectionPool = require('../../Utils/mysqlConnectionPool');
var filtreToSQL = require('../../Utils/Filtre');

var Tache = require('../Tache');
var Tag = require('../Tag');

class TacheDAO {

    static find(filtre, callback) {
        let tachesOutputList = [];

        // gestion du filtrage
        var filtreSQL = filtreToSQL(filtre);

        // génère le sql à partir des éléments reçus par le filtrage
        let sql = 'SELECT * FROM tache';
        if(filtreSQL != "") {
            sql += " WHERE " + filtreSQL;
        }

        // connexion bdd via le pool
        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            // exécution de la requête
            connection.query(sql, function(error, results, fields) {
                
                // On relache la connexion au pool
                connection.release();


                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }


                // reconstruction des objets après la sélection
                for(let i = 0; i < results.length; i++) {
                    tachesOutputList.push(new Tache(results[i].id, results[i].title, results[i].dateBegin, results[i].dateEnd, results[i].statut));
                }


                return callback(true, "Des tâches ont été trouvées.", tachesOutputList);
            });
        });
    }


    static findById(id, callback) {
        let tacheOutput = null;

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT * FROM tache WHERE id = ? LIMIT 1;', [id], function(error, results, fields) {

                // On relache la connexion au pool
                connection.release();

                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }

                
                if(results.length == 0) {
                    error = "Erreur: Cette tache n'existe pas.";
                    return callback(false, error, null);
                } else {
                    // reconstruction de l'objet après la sélection
                    tacheOutput = new Tache(results[0].id, results[0].title, results[0].dateBegin, results[0].dateEnd, results[0].statut);
                    return callback(true, "Une tâche a été trouvée.", tacheOutput);
                }   
            });
        });
    }


    static create(tache, callback) {
        // vérification de la validité de la tâche
        let error = tache.validateFields();
        if(error) {
            return callback(false, error, null);
        }


        mysqlConnectionPool.query('INSERT INTO tache SET title=?, dateBegin=?, dateEnd=?, statut=?;', [tache.title, tache.dateBegin, tache.dateEnd, tache.statut], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                tache.id = results.insertId; // modification de l'id pour récupèrer celui inséré
                return callback(true, "La tâche a été insérée.", tache);
            }
        });
    }


    static put(tache, newValues, callback) {
        tache.title     = newValues.title;
        tache.dateBegin = newValues.dateBegin;
        tache.dateEnd   = newValues.dateEnd;
        tache.statut    = newValues.statut;

        // vérification de la validité de la tâche
        let error = tache.validateFields();
        if(error) {
            return callback(false, error, null);
        }


        mysqlConnectionPool.query('UPDATE tache SET title=?, dateBegin=?, dateEnd=?, statut=? WHERE id=?;', [tache.title, tache.dateBegin, tache.dateEnd, tache.statut, tache.id], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "La tâche a été mise à jour.", tache);
            }
        });        
    }


    static delete(tache, callback) {
        return TacheDAO.deleteById(tache.id, callback);
    }


    static deleteById(id, callback) {
        mysqlConnectionPool.query('DELETE FROM tache WHERE id=?;', [id], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                // check si une ligne a été suprimé
                if(results.affectedRows == 0) {
                    error = "Erreur: Aucune ligne ne correspond à ces informations.";
                    return callback(false, error, null);
                } else {
                    return callback(true, "La tâche a été supprimée.", ""); // si on est ici => succès de la supression
                }
            }
        });
    }


    static getTacheTags(tache, callback) {
        let tagsOutputList = [];

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT tag.label FROM tag INNER JOIN tache_tag ON tag.label = tache_tag.tag_label WHERE tache_tag.tache_id = ?;', [tache.id], function(error, results, fields) {
                
                // On relache la connexion au pool
                connection.release();

                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }

                // reconstruction des tags après la sélection
                for(let i = 0; i < results.length; i++) {
                    tagsOutputList.push(new Tag(results[i].label));
                }

                return callback(true, "Des tags associés à cette tâche ont été trouvés.", tagsOutputList);
            });
        });
    }


    // ajouter un tag à une tâche
    static addTacheTags(tache, tagLabel, callback) {
        mysqlConnectionPool.query('INSERT INTO tache_tag VALUES (?, ?);', [tache.id, tagLabel], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "Tag ajouté à la tâche.", "");
            }

        });
    }


    // retirer un tage à une tâche
    static removeTacheTags(tache, tagLabel, callback) {
        mysqlConnectionPool.query('DELETE FROM tache_tag WHERE tache_id=? AND tag_label=?;', [tache.id, tagLabel], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                // check si une ligne a été suprimé
                if(results.affectedRows == 0) {
                    error = "Erreur: Aucune ligne ne correspond à ces informations.";
                    return callback(false, error, null);
                } else {
                    return callback(true, "Tag retiré à la tâche.", ""); // si on est ici => succès de la supression
                }
            }

        });
    }
}

module.exports = TacheDAO