<template>
  <div id="ListTaches">
    <h2 class="titlePage">Liste des tâches :</h2>
    <b-button v-on:click="openCreate()" class="btn btn-success btn-xs createButton" variant="success" v-b-modal.createTache>
      <b-icon icon="plus"></b-icon> 
      Ajouter
    </b-button>

    <table class="table table-bordred table-striped">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Titre</th>
          <th scope="col">Date début</th>
          <th scope="col">Date fin</th>
          <th scope="col">Statut</th>
          <th scope="col">Voir tout</th>
          <th scope="col">Editer</th>
          <th scope="col">Supprimer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tache in items" :key="tache.id">
          <td scope="row">{{ tache.id }}</td>
          <td>{{ tache.title }}</td>
          <td>{{ tache.dateBegin | moment("DD/MM/YYYY") }}</td>
          <td>{{ tache.dateEnd | moment("DD/MM/YYYY") }}</td>
          <td>{{ tache.statut }}</td>

          <td>
              <b-button v-on:click="openSee(tache)" class="btn-xs" variant="outline-info" v-b-modal.seeTache>
                  <b-icon icon="eye"></b-icon>
                  Voir
              </b-button>
          </td>
          <td>
            <b-button v-on:click="openModify(tache)" class="btn-xs" variant="primary" v-b-modal.createTache>
                <b-icon icon="pencil"></b-icon>
                Modifier
            </b-button>
          </td>
          <td>
            <button type="button" v-on:click="deleteElement(tache)" class="btn btn-danger btn-xs">
                <b-icon icon="trash"></b-icon>
                Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- modals création/modification tâche -->
    <b-modal scrollable size="lg" id="createTache" title="Création d'une tâche" >
      <div class="d-block text-center">
        <form>
          <div class="form-group">
            <div class="form-group">
              <label for="title">Titre</label>
              <input v-model="modalTitle" type="text" class="form-control" id="title" placeholder="Tâche 1">
            </div>
          </div>
          <div class="form-group">
            <div class="form-group">
              <label for="dateBegin">Date de début</label>
              <input v-model="modalDateBegin" type="date" class="form-control" id="dateBegin">
            </div>
          </div>
          <div class="form-group">
            <div class="form-group">
              <label for="dateEnd">Date de fin</label>
              <input v-model="modalDateEnd" type="date" class="form-control" id="dateEnd">
            </div>
          </div>
          <div class="form-group">
            <div class="form-group">
              <label for="statut">Statut</label>
              <b-form-select v-model="modalStatut" :options="statutPossible"></b-form-select>
            </div>
          </div>
        </form>

          <!-- modif tags -->
          <div v-if="modalId">
            <br/>
            <h3>Gestion des catégories</h3>

            <div class="form-group">
              <label for="taf">Ajouter une catégorie</label>
              <b-form-select v-model="newTag" :options="tags"></b-form-select>
            </div>

            <button type="button" v-on:click="addTagElement(modalId, newTag)" class="btn btn-outline-success btn-xs">
              <b-icon icon="plus"></b-icon>
              Ajouter catégorie
            </button>

            <hr/>
            <table class="table table-bordred table-striped">
              <thead>
                <tr>
                  <th scope="col">Label</th>
                  <th scope="col">Retirer</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="tag in modalTags" :key="tag.label">
                  <td scope="row">{{ tag.label }}</td>

                  <td>
                    <button type="button" v-on:click="deleteTagElement(modalId, tag)" class="btn btn-danger btn-xs">
                      <b-icon icon="trash"></b-icon>
                      Retirer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


      </div>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button v-if="modalId" size="xl" variant="success" @click="ok()" v-on:click="modify"><b-icon icon="check"></b-icon> Sauvegarder</b-button>
        <b-button v-else size="xl" variant="success" @click="ok()" v-on:click="create"><b-icon icon="check"></b-icon> Créer</b-button>
        <b-button size="xl" variant="danger" @click="cancel()"><b-icon icon="box-arrow-in-left"></b-icon> Annuler</b-button>
      </template>
    </b-modal>


    <!-- modals voir tâche -->
    <b-modal scrollable size="lg" id="seeTache" title="Visualisation complète d'une tâche" >
      <div class="d-block text-center">
        <table class="table table-bordred table-striped">
          <tbody>
            <tr>
              <td scope="row"><strong>ID</strong></td>
              <td>{{ modalId }}</td>
            </tr>
            <tr>
              <td><strong>Titre</strong></td>
              <td>{{ modalTitle }}</td>
            </tr>
            <tr>
              <td scope="row"><strong>Date de début</strong></td>
              <td>{{ modalDateBegin }}</td>
            </tr>
            <tr>
              <td scope="row"><strong>Date de fin</strong></td>
              <td>{{ modalDateEnd }}</td>
            </tr>
            <tr>
              <td scope="row"><strong>Statut</strong></td>
              <td>{{ modalStatut }}</td>
            </tr>
          </tbody>
        </table>

        <br/>
        <h3>Catégories</h3>
        <table class="table table-bordred table-striped">
        <thead>
          <tr>
            <th scope="col">Label</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tag in modalTags" :key="tag.label">
            <td scope="row">{{ tag.label }}</td>
          </tr>
        </tbody>
      </table>


      </div>
      <template v-slot:modal-footer="{ ok }">
        <b-button size="xl" variant="success" @click="ok()"><b-icon icon="X"></b-icon> Fermer</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import config from '../../../config.json';
import moment from 'moment';

export default {
  name: 'listTaches',
  data: function () {
    return {
        items: [],
        statutPossible: ['Non precise', 'En cours', 'Achevée','Une tache est recquise', 'Annulée'],
        modalId: null,
        modalTitle: null,
        modalDateBegin: null,
        modalDateEnd: null,
        modalStatut: null,
        modalTags: [], // liste des tags d'une tâche
        tags: [], // liste des tags qui existent
        newTag: 0 // nouvelle catégorie à ajouter
    }
  },
  mounted: function () {
    this.getTaches();
    this.getTags();
  },
  methods: {
    openCreate: function() {
      this.modalId = null;
      this.modalTitle = null;
      this.modalDateBegin = null;
      this.modalDateEnd = null;
      this.modalStatut = 'Non precise';
      this.modalTags = [];
    },
    openSee: function(tache) {
      this.modalId = tache.id;
      this.modalTitle = tache.title;
      this.modalDateBegin = moment(tache.dateBegin).format("YYYY-MM-DD");
      this.modalDateEnd = moment(tache.dateEnd).format("YYYY-MM-DD");
      this.modalStatut = tache.statut;

      this.getTacheTags(tache.id);
    },
    openModify: function(tache) {
      this.modalId = tache.id;
      this.modalTitle = tache.title;
      this.modalDateBegin = moment(tache.dateBegin).format("YYYY-MM-DD");
      this.modalDateEnd = moment(tache.dateEnd).format("YYYY-MM-DD");
      this.modalStatut = tache.statut;

      this.getTacheTags(tache.id);
    },
    getTaches: function() {
      this.axios({
        method: 'get',
        url: config.apiURL + '/taches',
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
    getTags: function() {
      this.axios({
        method: 'get',
        url: config.apiURL + '/tags',
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          let tmptags = response.data['results'];
          for (const tag of tmptags) {
            this.tags.push(tag.label);
          }

          typeFlash = 'success';
        } else {
          this.flash(response.data['message'], typeFlash, {
            timeout: 5000
          });
        }
      });
    },
    getTacheTags: function(tacheid) {
      this.axios({
        method: 'get',
        url: config.apiURL + '/taches/' + tacheid + '/tags',
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.modalTags = response.data['results'];
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
        url: config.apiURL + '/taches',
        data: {
          title: this.modalTitle,
          dateBegin: this.modalDateBegin,
          dateEnd: this.modalDateEnd,
          statut: this.modalStatut
        },
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        var typeFlash = "error";
        if(response.data['success']) {
          this.getTaches();
          typeFlash = "success";
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });


        this.modalId = null;
        this.modalTitle = null;
        this.modalDateBegin = null;
        this.modalDateEnd = null;
        this.modalStatut = 'Non precise';
      });
    },
    modify: function() {
      this.axios({
        method: 'put',
        url: config.apiURL + '/taches/' + this.modalId,
        data: {
          title: this.modalTitle,
          dateBegin: this.modalDateBegin,
          dateEnd: this.modalDateEnd,
          statut: this.modalStatut
        },
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.getTaches();
          typeFlash = 'success';
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });

        this.modalId = null;
        this.modalTitle = null;
        this.modalDateBegin = null;
        this.modalDateEnd = null;
        this.modalStatut = 'Non precise';
      });
    },
    deleteElement(tuple) {
      var deleteConfirm = confirm("Voulez-vous supprimer ?");
      if (deleteConfirm) {
        this.axios({
          method: 'delete',
          url: config.apiURL + "/taches/" + tuple.id,
          validateStatus: () => { return true; },
        }).then(response => {
          // gestion des erreurs api
          let typeFlash = 'error';
          if(response.data['success']) {
            this.getTaches();
            typeFlash = 'success';
          }

          this.flash(response.data['message'], typeFlash, {
            timeout: 5000
          });
        });
      }
    },
    addTagElement(modalId, tag) {
      this.axios({
        method: 'post',
        url: config.apiURL + "/taches/" + modalId + '/tags',
        data: {
          tagLabel: tag
        },
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.getTacheTags(modalId);
          typeFlash = 'success';
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });
      });
    },
    deleteTagElement(modalId, tag) {
      this.axios({
        method: 'delete',
        url: config.apiURL + "/taches/" + modalId + '/tags/' + tag.label,
        validateStatus: () => { return true; },
      }).then(response => {
        // gestion des erreurs api
        let typeFlash = 'error';
        if(response.data['success']) {
          this.getTacheTags(modalId);
          typeFlash = 'success';
        }

        this.flash(response.data['message'], typeFlash, {
          timeout: 5000
        });
      });
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