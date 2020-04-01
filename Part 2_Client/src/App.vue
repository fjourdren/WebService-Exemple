<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
      <b-navbar-brand href="/">Gestionnaire de tâches</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item><router-link class="nav-link" active-class="active" to="/taches">Tâches</router-link></b-nav-item>
          <b-nav-item><router-link class="nav-link" active-class="active" to="/tachesFiltre">Tâches filtrées</router-link></b-nav-item>
          <b-nav-item><router-link class="nav-link" active-class="active" to="/tags">Catégories</router-link></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <flash-message></flash-message>
          <router-view></router-view>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  
  name: 'App',
  mounted: function() {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navbar {
  padding: 5px 70px;
}

.container {
  padding-top: 20px;
}
</style>
