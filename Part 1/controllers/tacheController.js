var TacheDAO = require('../models/DAO/TacheDAO');
var Tache = require('../models/Tache');


// récupère la liste de toutes les tâches
exports.findAllTache = function(req, res, next) {
    TacheDAO.find(function(err, taches) {
        let httpCode = 200;
        if(err != null) {
            httpCode = 500;
        }

        res.status(httpCode).json({error: err, results: taches});
    });
};


// lecture d'une tâche par id
exports.findTacheById = function(req, res, next) {
    TacheDAO.findById(req.params.id, function (err, tache) {
        let httpCode = 200;
        if(err != null) {
            httpCode = 500;
        }

        res.status(httpCode).json({error: err, results: tache});
    });
};


// création d'une tâche
exports.createTache = function(req, res, next) {
    // création de l'objet
    var tache = new Tache(null, req.body.title, req.body.dateBegin, req.body.dateEnd, req.body.statut, req.body.tags);

    // sauvegarde de l'objet
    TacheDAO.create(tache, function (err, tache) {
        let httpCode = 201;
        if(err != null) {
            httpCode = 500;
        }

        res.status(httpCode).json({error: err, results: tache});
    });
};


// mise à jour d'une tâche
exports.updateTache = function(req, res, next) {
    // on récupère la tâche avec cet id
    TacheDAO.findById(req.params.id, function(err, tache) {
        if(err != null) {
            res.status(500).json({error: err, results: null});
            return;
        }

        // on modifie les valeurs de la tache avec les valeurs passés en paramètre
        TacheDAO.put(tache, req.body, function (err, tache) {
            let httpCode = 201;
            if(err != null) {
                httpCode = 500;
            }

            res.status(httpCode).json({error: err, results: tache});
        });
    });
};


// supression d'une tâche
exports.deleteTache = function(req, res, next) {
    TacheDAO.deleteById(req.params.id, function (err, tache) {
        let httpCode = 200;
        if(err != null) {
            httpCode = 500;
        }

        res.status(httpCode).json({error: err, results: tache});
    });
};