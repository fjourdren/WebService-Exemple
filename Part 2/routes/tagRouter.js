var express = require('express');
var router = express.Router();

// import des controlleurs
var tagController = require('../controllers/tagController');


router.get('/', tagController.findAllTags);  // récupère la liste des tags
router.get('/:label', tagController.findTagByLabel);  // lecture d'un tag
router.post('/', tagController.createTag);  // création d'un tag
router.put('/:label', tagController.updateTag); // mise à jour d'un tag
router.delete('/:label', tagController.deleteTag); // supression tag

router.get('/:label/taches', tagController.findTagTaches); // récupère les taches ayant ce tag

module.exports = router;