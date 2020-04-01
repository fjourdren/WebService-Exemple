var StatutDAO = require('../models/DAO/StatutDAO');
var Statut = require('../models/Statut');

// récupère la liste de toutes les statuts
exports.findAllStatuts = function(req, res, next) {
    StatutDAO.find(function(success, message, statuts) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, nbResults: statuts.length, results: statuts});
    });
};


// lecture d'une statut par label
exports.findStatutByLabel = function(req, res, next) {
    StatutDAO.findByLabel(req.params.label, function(success, message, statut) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, results: statut});
    });
};


// création d'un statut
exports.createStatut = function(req, res, next) {
    // création de l'objet
    var statut = new Statut(req.body.label);
    
    // sauvegarde de l'objet
    StatutDAO.create(statut, function(success, message, statut) {
        let httpCode = 201;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, results: statut});
    });
};


// mise à jour d'un statut
exports.updateStatut = function(req, res, next) {
    // on récupère le statut avec ce label
    StatutDAO.findByLabel(req.params.label, function(success, message, statut) {
        if(!success) {
            res.status(500).json({success: success, message: message, results: null});
            return;
        }

        // on modifie les valeurs d'un statut avec les valeurs passés en paramètre
        StatutDAO.put(statut, req.body, function(success, message, statut) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success: success, message: message, results: statut});
        });
    });
};


// supression d'un statut
exports.deleteStatut = function(req, res, next) {
    StatutDAO.deleteByLabel(req.params.label, function(success, message, statut) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success: success, message: message, results: statut});
    });
};


// récupère les taches ayant ce statut
exports.findStatutTaches = function(req, res, next) {
    // on récupère le statut avec ce label
    StatutDAO.findByLabel(req.params.label, function(success, message, statut) {
        if(!success) {
            res.status(500).json({success: success, message: message, results: null});
            return;
        }

        var filtre = req.query; // récupère les éléments passé en vatiable GET pour créer le filtrage

        // récupère la liste des taches ayant le statut
        StatutDAO.getStatutTaches(statut, filtre, function(success, message, taches) {
            let httpCode = 200;
            if(!success) {
                httpCode = 500;
            }
    
            res.status(httpCode).json({success: success, message: message, nbResults: taches.length, results: taches});
        });
    });
};