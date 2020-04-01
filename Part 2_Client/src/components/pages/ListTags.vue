<template>
  <div id="Listtags">
    <h2 class="titlePage">Liste des catégories :</h2>
    <b-button v-on:click="openCreate()" class="btn btn-success btn-xs createButton" variant="success" v-b-modal.createtag>
      <b-icon icon="plus"></b-icon> 
      Ajouter
    </b-button>

    <table class="table table-bordred table-striped">
        <thead>
            <tr>
                <th scope="col">Label</th>
                <th scope="col">Voir tâches</th>
                <th scope="col">Editer</th>
                <th scope="col">Supprimer</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="tag in items" :key="tag.label">
                <td scope="row">{{ tag.label }}</td>
                <td>
                  <b-button v-on:click="openTagTaches(tag)" class="btn-xs" variant="outline-info" v-b-modal.showTaches>
                      <b-icon icon="eye"></b-icon>
                      Voir tâches
                  </b-button>
                </td>
                <td>
                  <b-button v-on:click="openModify(tag)" class="btn-xs" variant="primary" v-b-modal.createtag>
                      <b-icon icon="pencil"></b-icon>
                      Modifier
                  </b-button>
                </td>
                <td>
                  <button type="button" v-on:click="deleteElement(tag)" class="btn btn-danger btn-xs">
                      <b-icon icon="trash"></b-icon>
                      Supprimer
                  </button>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- modals création/modification catégorie -->
    <b-modal scrollable size="lg" id="createtag" title="Création d'une catégorie" >
      <div class="d-block text-center">
        <form>
          <div class="form-group">
            <div class="form-group">
              <label for="label">Label</label>
              <input v-model="modalLabel" type="text" class="form-control" id="label" placeholder="Web">
            </div>
          </div>
        </form>


      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button v-if="startmodalLabel" size="xl" variant="success" @click="ok()" v-on:click="modify"><b-icon icon="check"></b-icon> Sauvegarder</b-button>
        <b-button v-else size="xl" variant="success" @click="ok()" v-on:click="create"><b-icon icon="check"></b-icon> Créer</b-button>
        <b-button size="xl" variant="danger" @click="cancel()"><b-icon icon="box-arrow-in-left"></b-icon> Annuler</b-button>
      </template>
    </b-modal>


    <!-- modal Taches -->
    <b-modal scrollable size="lg" id="showTaches" title="Tâches de la catégorie">
      <div class="d-block text-center">
        <table class="table table-bordred table-striped">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Titre</th>
              <th scope="col">Date début</th>
              <th scope="col">Date fin</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tache in modalTagTaches" :key="tache.id">
              <td scope="row">{{ tache.id }}</td>
              <td>{{ tache.title }}</td>
              <td>{{ tache.dateBegin | moment("DD/MM/YYYY") }}</td>
              <td>{{ tache.dateEnd | moment("DD/MM/YYYY") }}</td>
              <td>{{ tache.statut }}</td>
            </tr>
          </tbody>
        </table>

      </div>
      <template v-slot:modal-footer="{ ok }">
        <b-button size="xl" variant="success" @click="ok()"><b-icon icon="check"></b-icon> Fermer</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import config from '../../../config.json';

export default {
  name: 'listtags',
  data: function () {
    return {
        items: [],
        startmodalLabel: null,
        modalLabel: null,
        modalTagTaches: []
    }
  },
  mounted: function () {
    this.gettags();
  },
  methods: {
    openCreate: function() {
        this.startmodalLabel = null;
        this.modalLabel = null;
    },
    openModify: function(tag) {
        this.startmodalLabel = tag.label;
        this.modalLabel = tag.label;
    },
    openTagTaches: function(tag) {
      this.axios({
        method: 'get',
        url: config.apiURL + '/tags/' + tag.label + '/taches',
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.modalTagTaches = response.data['results'];
          typeFlash = 'success';
        } else {
          this.flash(response.data['message'], typeFlash, {
            timeout: 5000
          });
        }
      });
    },
    gettags: function() {
      this.axios({
        method: 'get',
        url: config.apiURL + '/tags',
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.items = response.data['results'];
          typeFlash = 'success';
        } else {
          this.flash(response.data['message'], typeFlash, {
            timeout: 5000
          });
        }
      });
    },
    create: function() {
      this.axios({
        method: 'post',
        url: config.apiURL + '/tags',
        data: {
          label: this.modalLabel
        },
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.gettags();
          typeFlash = 'success';
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });

        

        this.startmodalLabel = null;
        this.modalLabel = null;
      });
    },
    modify: function() {
      this.axios({
        method: 'put',
        url: config.apiURL + '/tags/' + this.startmodalLabel,
        data: {
          label: this.modalLabel
        },
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.gettags();
          typeFlash = 'success';
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });

        this.startmodalLabel = null;
        this.modalLabel = null;
      });
    },
    deleteElement(tuple) {
        var deleteConfirm = confirm("Voulez-vous supprimer ?");
        if (deleteConfirm) {
          this.axios({
            method: 'delete',
            url: config.apiURL + "/tags/" + tuple.label,
            data: {
              label: this.modalLabel
            },
            validateStatus: () => { return true; },
          }).then(response => {
            // gestion des erreurs api
            let typeFlash = 'error';
            if(response.data['success']) {
              this.gettags();
              typeFlash = 'success';
            }

            this.flash(response.data['message'], typeFlash, {
              timeout: 5000
            });
          });
        }
    }
  }
}
</script>

<style>
.createButton {
    float: left;
    margin: 0 0 15px 0;
}

.titlePage {
    text-align: left;
}

label {
  float: left;
  font-weight: bold;
}
</style>