var log = require('log4js').getLogger("TagDAO");

var mysqlConnectionPool = require('../../Utils/mysqlConnectionPool');
var filtreToSQL = require('../../Utils/Filtre');

var Tag = require('../Tag');
var Tache = require('../Tache');

class TagDAO {

    static find(callback) {
        let tagsOutputList = [];

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT * FROM  tag;', function(error, results, fields) {
                
                // On relache la connexion au pool
                connection.release();


                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }


                // reconstruction des objets après la sélection
                for(let i = 0; i < results.length; i++) {
                    tagsOutputList.push(new Tag(results[i].label));
                }


                return callback(true, "Des tags ont été trouvés.", tagsOutputList);
            });
        });      
    }

    static findByLabel(label, callback) {
        let tagOutput = null;

        mysqlConnectionPool.getConnection(function(error, connection) {
            // erreur de connexion serveur SQL
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Connexion à la base de données impossible.", null);
            }

            connection.query('SELECT * FROM tag WHERE label=? LIMIT 1;', [label], function(error, results, fields) {

                // On relache la connexion au pool
                connection.release();


                // gestion des erreurs lié à la requête SQL
                if(error) {
                    log.error(error);
                    return callback(false, "Erreur: Erreur de requête.", null);
                }


                
                if(results.length == 0) {
                    error = "Erreur: Cette catégorie n'existe pas.";
                    return callback(false, error, null);
                } else {
                    // reconstruction de l'objet après la sélection
                    tagOutput = new Tag(results[0].label);
                    return callback(true, "Un tag a été trouvé.", tagOutput);
                    
                }
                
            });
        });
    }

    static create(tag, callback) {
        // vérification de la validité d'un tag
        let error = tag.validateFields();
        if(error) {
            return callback(false, error, null);
        }

        mysqlConnectionPool.query('INSERT INTO tag VALUE (?);', [tag.label], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "Le tag a été inséré.", tag);
            }
        });
    }

    static put(tag, newValues, callback) {
        let oldValue = tag.label;
        tag.label = newValues.label;

        // vérification de la validité d'un tag
        let error = tag.validateFields();
        if(error) {
            return callback(false, error, null);
        }


        mysqlConnectionPool.query('UPDATE tag SET label=? WHERE label = ?;', [tag.label, oldValue], function(error, results, fields) {
            // gestion des erreurs lié à la requête SQL ou à la connexion
            if(error) {
                log.error(error);
                return callback(false, "Erreur: Erreur de requête ou de connexion à la base de données.", null);
            } else {
                return callback(true, "Le tag a été mis à jour.", tag);
            }
        });
    }

    static delete(tag, callback) {
        return TagDAO.deleteByLabel(tag.label, callback);
    }

    static deleteByLabel(label, callback) {
        mysqlConnectionPool.query('DELETE FROM tag WHERE label=?;', [label], function(error, results, fields) {
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
                    return callback(true, "Le tag a été supprimé.", ""); // si on est ici => succès de la supression
                }
            }
        });
    }

    static getTagTaches(tag, filtre, callback) {
        let tachesOutputList = [];

        // gestion du filtrage
        var filtreSQL = filtreToSQL(filtre);

        // génère le sql à partir des éléments reçus par le filtrage
        let sql = 'SELECT tache.* FROM tache INNER JOIN tache_tag ON tache.id = tache_tag.tache_id WHERE tache_tag.tag_label = ?';
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

            connection.query(sql, [tag.label], function(error, results, fields) {
                
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
                
                
                return callback(true, "Des tâches associées au tag ont été trouvées.", tachesOutputList);
            });
        });
    }
}

module.exports = TagDAO