# Description
Projet scolaire d'écriture d'un service web REST de gestion des tâches.

# PART 1 (Port 8081)
`cd Part\ 1
npm install
npm run start`




# PART 2
## Démarrage serveur (Port 8081) :
`cd Part\ 2
npm install
npm run start`

ou `./RUN.sh`

La configuration est disponible dans le fichier "config.json" a la racine. Permets de modifier les accès base de données et le port du web service.



## Démarrage client (Vue.JS), (Port 8080) :
`cd Part\ 2_Client
npm install
npm run serve`

ou `./RUN_CLIENT.sh`

La configuration est disponible dans le fichier "config.json" a la racine. Permets de modifier l'URL d'accès au web service.



# Informations
* Ou exécuter pour chaque partie du projet le script RUN .sh.

* Le client développé en exemple ne montre qu'une partie des fonctionnalités géré par le service REST.
* Le client VueJS n'est pas bien décomposé en composant pour faire un exemple de client plus facilement.

Fonctionnalités :
* Gestion Tâche
* Gestion Catégorie (tag)
* Catégories d'une tâche
* Tâches d'une catégorie
* Gestion statut
* Fichier de configuration JSON
* Filtrage avancé (avec différents opérateurs), utilisable partout lors de la récupération de tâche
* Retour du code HTTP différent en fonction de la réussite ou non côté serveur
* Information sur le succès ou non d'une action
* Renvoie un message indiquant l'état de l'action dans le service web (succès comme erreur, les erreurs SQL ne sont pas envoyées pour plus de sécurité)
* Valeur de succès ou non de la requête par le service web
* Le service renvoie le nombre d'éléments ramenés dans le résultat pour les tableaux
* Log complet est séparé dans plusieurs branches de gestion des logs à l'aide de Log4 JS