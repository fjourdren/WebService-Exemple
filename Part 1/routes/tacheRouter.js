var express = require('express');
var router = express.Router();

// import des controlleurs
var tacheController = require('../controllers/tacheController');


// gestion des tâches
router.get('/', tacheController.findAllTache);  // récupère la liste des tâches
router.get('/:id', tacheController.findTacheById);  // lecture d'une tâche
router.post('/', tacheController.createTache);  // création d'une tâche
router.put('/:id', tacheController.updateTache); // mise à jour d'une tâche
router.delete('/:id', tacheController.deleteTache); // supression tâche

module.exports = router;