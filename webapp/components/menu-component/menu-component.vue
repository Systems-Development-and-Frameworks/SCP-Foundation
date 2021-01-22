<template>
  <div class="menuButton">
    <template v-if="loggedIn"> 
      <button @click="logout">Logout</button>
    </template>
    <template v-else>
      <NuxtLink to="/login">Login</NuxtLink>
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
  },
};
</script>

<style>
.menuButton{
  text-align: right;
  padding-right: 20px;
}
</style>

