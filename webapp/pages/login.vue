<template>
  <div id="login-component">
    <login-form-component></login-form-component>
  </div>
</template>

<script>

import LoginFormComponent from '../components/login-form-component/login-form-component.vue';

export default {
  name: "App",
  components: {
    LoginFormComponent
  },
};
</script>

<style>
#login-component{
  text-align: center;
}
</style>
