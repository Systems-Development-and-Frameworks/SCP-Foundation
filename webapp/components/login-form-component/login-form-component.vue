<template>
  <div>
    <form>
      <div>
        <label for="username">Username</label>
        <br>
        <input id="username" type="text" />
      </div>
      <div>
        <label for="password">Password</label>
        <br>
        <input id="password" type="password" />
      </div>
    </form>
  </div>
</template>

<script>
import Index from "../../pages/index.vue";

export default {
  name: "LoginFormComponent",
  components: {
    Index,
  },
};
</script>

<style>
label{
  text-align: left;

}
</style>
