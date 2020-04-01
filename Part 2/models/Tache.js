var moment = require('moment');

class Tache {
    constructor(id, title, dateBegin, dateEnd, statut) {
        this.id = id;
        this.title = title;
        this.dateBegin = dateBegin;
        this.dateEnd = dateEnd;
        this.statut = statut;
    }

    // fonction qui permet de faire les vérifications de types et des valeurs nulles
    validateFields() {
        if(this.id != null && typeof this.id != 'number') {
            return "Erreur : L'identifiant n'est pas numérique.";
        }
        
        if(this.title == null || this.title == undefined) {
            return "Erreur : Le titre de la tâche est nul.";
        }

        if(this.dateBegin == null || this.dateBegin == undefined) {
            return "Erreur : La date de début de la tâche est nulle.";
        }

        if(!moment(this.dateBegin).isValid()) {
            return "Erreur : Date de début invalide.";
        }

        if(this.dateEnd == null || this.dateEnd == undefined) {
            return "Erreur : La date de fin de la tâche est nul.";
        }

        if(!moment(this.dateEnd).isValid()) {
            return "Erreur : Date de fin invalide.";
        }

        if(!this.statut in ['Non precise', 'En cours', 'Achevée', 'Une tache est recquise', 'Annulée']) {
            return "Erreur : Le statut de la tâche est non valide.";
        }

        return null;
    }
}

module.exports = Tache