/* === Gestion par liste des tâches === */
// si on ne souhaite pas utiliser la base de données, alors on utilise une liste de tâches
var prochainId = 1; // la prochaine tâche prendra l'ID 1, permet de simuler un AUTO_INCREMENTS
var tachesList = [];
/* ====================================*/


module.exports = {prochainId, tachesList}