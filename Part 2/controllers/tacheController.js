var TacheDAO = require('../models/DAO/TacheDAO');
var Tache = require('../models/Tache');

// récupère la liste de toutes les tâches
// exemple avec un filtre: http://127.0.0.1:8081/taches/?statut=diff_Achevée&statut=diff_Annulée&dateEnd=supequa_2020-03-29
exports.findAllTache = function(req, res, next) {
    var filtre = req.query; // récupère les éléments passé en vatiable GET pour créer le filtrage

    TacheDAO.find(filtre, function(success, message, taches) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, nbResults: taches.length, results: taches});
    });
};


// lecture d'une tâche par id
exports.findTacheById = function(req, res, next) {
    TacheDAO.findById(req.params.id, function(success, message, tache) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, results: tache});
    });
};


// création d'une tâche
exports.createTache = function(req, res, next) {
    // création de l'objet
    var tache = new Tache(null, req.body.title, req.body.dateBegin, req.body.dateEnd, req.body.statut, req.body.tags);

    // sauvegarde de l'objet
    TacheDAO.create(tache, function(success, message, tache) {
        let httpCode = 201;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, results: tache});
    });
};


// mise à jour d'une tâche
exports.updateTache = function(req, res, next) {
    // on récupère la tâche avec cet id
    TacheDAO.findById(req.params.id, function(success, message, tache) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }

        // on modifie les valeurs de la tache avec les valeurs passés en paramètre
        TacheDAO.put(tache, req.body, function(success, message, tache) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success, success, message: message, results: tache});
        });
    });
};


// supression d'une tâche
exports.deleteTache = function(req, res, next) {
    TacheDAO.deleteById(req.params.id, function(success, message, tache) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, results: tache});
    });
};


// récupère les tags d'une tâche
exports.findTacheTags = function(req, res, next) {
    // on récupère la tâche avec cet id
    TacheDAO.findById(req.params.id, function(success, message, tache) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }

        // récupère la liste des tags de cette tâche
        TacheDAO.getTacheTags(tache, function(success, message, tags) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success, success, message: message, nbResults: tags.length, results: tags});
        });
    });
};


// ajouter un tag à une tâche
exports.addTacheTags = function(req, res, next) {
    if(req.body.tagLabel == null) {
        res.status(500).json({success: false, message: "Erreur: Le label du tag à ajouté n'est pas défini.", results: null});
        return;
    }

    // on récupère la tâche avec cet id
    TacheDAO.findById(req.params.id, function(success, message, tache) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }
        
        // récupère la liste des tags de cette tâche
        TacheDAO.addTacheTags(tache, req.body.tagLabel, function(success, message, tags) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success, success, message: message, results: tags});
        });
    });
};


// retirer un tag à une tâche
exports.removeTacheTags = function(req, res, next) {
    if(req.params.tagLabel == null) {
        res.status(500).json({success: false, message: "Erreur: Le label du tag à retirer n'est pas défini.", results: null});
        return;
    }

    // on récupère la tâche avec cet id
    TacheDAO.findById(req.params.id, function(success, message, tache) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }
        
        // récupère la liste des tags de cette tâche
        TacheDAO.removeTacheTags(tache, req.params.tagLabel, function(success, message, tags) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success, success, message: message, results: tags});
        });
    });
};