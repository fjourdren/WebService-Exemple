var listDatabase = require('../../listDatabase');

var Tache = require('../Tache');

class TacheDAO {

    static find(callback) {
        return callback(null, listDatabase.tachesList);
    }


    static findById(id, callback) {
        for (let i = 0; i < listDatabase.tachesList.length; i++) {
            let tacheInTest = listDatabase.tachesList[i];
            if(tacheInTest.id == id) {
                return callback(null, tacheInTest);
            }
        }

        return callback(null, null);
    }


    static create(tache, callback) {
        // vérification de la validité de la tâche
        let error = tache.validateFields();
        
        tache.id = listDatabase.prochainId;
        listDatabase.prochainId += 1;
        listDatabase.tachesList.push(tache);

        return callback(error, tache);
    }


    static put(tache, newValues, callback) {
        console.log(tache)
        tache.title     = newValues.title;
        tache.dateBegin = newValues.dateBegin;
        tache.dateEnd   = newValues.dateEnd;
        tache.statut    = newValues.statut;

        // vérification de la validité de la tâche
        let error = tache.validateFields();
        if(error) {
            return callback(error, null);
        }


        for (let i = 0; i < listDatabase.tachesList.length; i++) {
            let tacheInTest = listDatabase.tachesList[i];
            if(tacheInTest.id == tache.id) {
                listDatabase.tachesList[i] = tache;
                return callback(null, tache);
            }
        }

        return callback("Erreur: Tâche non trouvée.", null);
    }


    static delete(tache, callback) {
        return TacheDAO.deleteById(tache.id, callback);
    }


    static deleteById(id, callback) {
        for (let i = 0; i < listDatabase.tachesList.length; i++) {
            let tacheInTest = listDatabase.tachesList[i];
            if(tacheInTest.id == id) {
                listDatabase.tachesList.splice(i, 1);
                return callback(null, "");
            }
        }

        return callback("Erreur: Tâche non trouvée.", null);
    }
}

module.exports = TacheDAO