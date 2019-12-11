<template>
  <section>
    <nav>
    <div class="nav-wrapper blue lighten-2">
      <a href="#!" class="brand-logo">Logo</a>
      <a href="#!" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
      <ul class="right hide-on-med-and-down">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/login" v-if="!auth">Login</router-link></li>
        <li><router-link to="/register" v-if="!auth">Register</router-link></li>
        <li><router-link to="/dashboard" v-if="auth">Dashboard</router-link></li>
        <li><a @click.prevent="logoutUser" v-if="auth">Logout</a></li>
      </ul>
    </div>
  </nav>

  <ul ref="sidenav" class="sidenav" id="mobile-demo">
    <li><router-link to="/">Home </router-link></li>
    <li><router-link to="/login" v-if="!auth">Login</router-link></li>
    <li><router-link to="/register" v-if="!auth">Register</router-link></li>
    <li><router-link to="/dashboard" v-if="auth">Dashboard</router-link></li>
    <li><a @click.prevent="logoutUser" v-if="auth">Logout</a></li>
  </ul>
  </section>
  <!-- <div id="nav">
    <a @click="logoutUser">Logout</a>
  </div> -->
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Navbar',
  mounted() {
    this.$M.Sidenav.init(this.$refs.sidenav);
  },
  methods: {
    ...mapActions([
      'logout',
    ]),
    async logoutUser() {
      await this.logout();
      this.$router.push('/login');
    }
  },
  computed: {
    ...mapGetters([
      'auth',
    ])
  }
}
</script>
