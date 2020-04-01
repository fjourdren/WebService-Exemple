class Statut {
    constructor(label) {
        this.label = label;
    }

    // fonction qui permet de faire les vérifications de types et des valeurs nulles
    validateFields() {        
        if(this.label == null || this.label == undefined) {
            return "Erreur : Le label du statut est nul.";
        }

        return null;
    }
}

module.exports = Statut