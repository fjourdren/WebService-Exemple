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

La configuration est disponible dans le fichier "config.json" a la racine : permets de modifier les accès base de données et le port du web service.



## Démarrage client (Vue.JS), (Port 8080) :
`cd Part\ 2_Client
npm install
npm run serve`

ou `./RUN_CLIENT.sh`

La configuration est disponible dans le fichier "config.json" a la racine : permets de modifier l'URL d'accès au web service.



# Informations
* Le client développé en exemple ne montre qu'une partie des fonctionnalités géré par le service web.
* Le client VueJS n'est pas bien décomposé en composant dans le but de réaliser un exemple de client plus rapidement.

# Fonctionnalités :
* Gestion Tâche
* Gestion Catégorie (tag)
* Lien entre les tâches et les catégories
* Gestion des statuts des tâches
* Fichier de configuration JSON
* Filtrage avancé (avec différents opérateurs), utilisable sur la récupération des tâches
* Retour de codes HTTP différents en fonction de la réussite ou non de l'action
* Renvoie un message indiquant l'état de l'action dans le service web (succès et erreur, les erreurs SQL ne sont pas envoyées pour plus de sécurité)
* Informe du succès ou de l'échec d'une requête
* Le service renvoie le nombre d'éléments ramenés dans le résultat pour les tableaux
* Log complet et filtré dans plusieurs branches à l'aide de Log4js