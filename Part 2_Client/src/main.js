import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueFlashMessage from 'vue-flash-message';
import vueMoment from 'vue-moment';

import { BootstrapVue, IconsPlugin, TablePlugin, AlertPlugin, ModalPlugin } from 'bootstrap-vue'


// import de certains fichiers css utiles
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-flash-message/dist/vue-flash-message.min.css';


// include de BootstrapVue
Vue.use(BootstrapVue)
// include de certains plugins de bootstap
Vue.use(IconsPlugin)
Vue.use(TablePlugin)
Vue.use(AlertPlugin)
Vue.use(ModalPlugin)


Vue.config.productionTip = false


// import des vues utiles
import App from './App.vue'

// setup du routeur
Vue.use(VueRouter)

// use axios for api calling
Vue.use(VueAxios, axios)

// utilisation des flashs messages
Vue.use(VueFlashMessage);

// utilisation pour la gestion des dates
Vue.use(vueMoment);

// import des pages
import listTaches from './components/pages/ListTaches.vue'
import ListTachesFiltrage from './components/pages/ListTachesFiltrage.vue'
import listTags from './components/pages/ListTags.vue'

const router = new VueRouter({
  routes: [
    { path: '/', component: listTaches },
    { path: '/taches', component: listTaches },
    { path: '/tachesFiltre', component: ListTachesFiltrage },
    { path: '/tags', component: listTags }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
