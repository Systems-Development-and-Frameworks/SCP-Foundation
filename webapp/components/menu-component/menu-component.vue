<template>
  <div class="menuButton">
    <template v-if="loggedIn">
      <button @click="logoutUser" id="logoutButton">Logout</button>
    </template>
    <template v-else>
      <NuxtLink to="/login" id="loginButton">Login</NuxtLink>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "MenuComponent",
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },
  methods: {
    ...mapActions('auth', ['logout']),
    ...mapActions('auth', ['cookieLogin']),
    logoutUser() {
      this.logout()
      this.$apolloHelpers.onLogout()
    }
  },
  created () {
    //TODO: make this work in tests
    //let token = this.$apolloHelpers.getToken()
    //if (token) this.cookieLogin({token})
  },
};
</script>

<style>
.menuButton{
  text-align: right;
  padding-right: 20px;
}
</style>

