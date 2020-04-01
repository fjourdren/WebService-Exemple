var express = require('express');
var router = express.Router();

// import des controlleurs
var statutController = require('../controllers/statutController');


router.get('/', statutController.findAllStatuts);  // récupère la liste des statuts
router.get('/:label', statutController.findStatutByLabel);  // lecture d'un statut
router.post('/', statutController.createStatut);  // création d'un statut
router.put('/:label', statutController.updateStatut); // mise à jour d'un statut
router.delete('/:label', statutController.deleteStatut); // supression statut

router.get('/:label/taches', statutController.findStatutTaches); // récupère les taches ayant ce statut

module.exports = router;