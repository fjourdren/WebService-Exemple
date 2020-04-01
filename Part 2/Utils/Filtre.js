function filtreToSQL(filtresArray) { // Uniquement compatible avec AND
    /** Exemples:
     * ?statut=diff_En cours&dateEnd=2020-06-29      =>  status<>En cours AND dateEnd=2020-06-29
     * ?statut=diff_En cours&dateEnd=inf_2020-06-29  =>  status<>En cours AND dateEnd<2020-06-29
    */
    let sqlOutput = "";

    let keys = Object.keys(filtresArray);
    // pour chaque entrée dans le filtre on va ajouter une condition
    for (let i = 0; i < keys.length; i++) {
        let operator = "=";

        let key = keys[i];
        let content = filtresArray[keys[i]];

        // si il y a une valeur unique, on l'a force à être dans un tableau pour gérer plus tards différentes conditions sur une seule variable
        if(!Array.isArray(content)) {
            content = [content];
        }

        // gestion si il y a plusieurs conditions sur une seule variable
        let subValueKeys = Object.keys(content);
        for (let i = 0; i < subValueKeys.length; i++) {
            let subContent = content[i];

            let contentValue;


            // on détermine l'opérateur 
            let contentSplited = subContent.split("_");
            if(contentSplited.length > 1) {
                switch(contentSplited[0]) {
                    case "equa":
                        operator = "=";
                        break;
                    case "diff":
                        operator = "<>";
                        break;
                    case "inf":
                        operator = "<";
                        break;
                    case "sup":
                        operator = ">";
                        break;
                    case "infequa":
                        operator = "<=";
                        break;
                    case "supequa":
                        operator = ">=";
                        break;
                    default:
                        operator = "=";
                        break;
                }

                // valeur à comparer
                contentValue = contentSplited[1];
            } else {
                // si il n'y a pas d'indication sur l'opérateur à utiliser, alors le contenu d'entré est le contenu de comparaison
                contentValue = subContent;
            }
            

            // on ajoute AND entre les différentes conditions
            if(sqlOutput != "") {
                sqlOutput += " AND ";
            }

            sqlOutput += key + operator + "'" + contentValue + "'";
        }
    }

    return sqlOutput;
}

module.exports = filtreToSQL