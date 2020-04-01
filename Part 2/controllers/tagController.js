var TagDAO = require('../models/DAO/TagDAO');
var Tag = require('../models/Tag');

// récupère la liste de toutes les tags
exports.findAllTags = function(req, res, next) {
    TagDAO.find(function(success, message, tags) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, nbResults: tags.length, results: tags});
    });
};


// lecture d'une tag par label
exports.findTagByLabel = function(req, res, next) {
    TagDAO.findByLabel(req.params.label, function(success, message, tag) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, results: tag});
    });
};


// création d'un tag
exports.createTag = function(req, res, next) {
    // création de l'objet
    var tag = new Tag(req.body.label);
    
    // sauvegarde de l'objet
    TagDAO.create(tag, function(success, message, tag) {
        let httpCode = 201;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, results: tag});
    });
};


// mise à jour d'un tag
exports.updateTag = function(req, res, next) {
    // on récupère le tag avec ce label
    TagDAO.findByLabel(req.params.label, function(success, message, tag) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }

        // on modifie les valeurs d'un tag avec les valeurs passés en paramètre
        TagDAO.put(tag, req.body, function(success, message, tag) {
            let httpCode = 201;
            if(!success) {
                httpCode = 500;
            }

            res.status(httpCode).json({success, success, message: message, results: tag});
        });
    });
};


// supression d'un tag
exports.deleteTag = function(req, res, next) {
    TagDAO.deleteByLabel(req.params.label, function(success, message, tag) {
        let httpCode = 200;
        if(!success) {
            httpCode = 500;
        }

        res.status(httpCode).json({success, success, message: message, results: tag});
    });
};


// récupère les taches ayant ce tag
exports.findTagTaches = function(req, res, next) {
    // on récupère le tag avec ce label
    TagDAO.findByLabel(req.params.label, function(success, message, tag) {
        if(!success) {
            res.status(500).json({success, success, message: message, results: null});
            return;
        }

        var filtre = req.query; // récupère les éléments passé en vatiable GET pour créer le filtrage

        // récupère la liste des taches ayant le tag
        TagDAO.getTagTaches(tag, filtre, function(success, message, taches) {
            let httpCode = 200;
            if(!success) {
                httpCode = 500;
            }
    
            res.status(httpCode).json({success, success, message: message, nbResults: taches.length, results: taches});
        });
    });
};