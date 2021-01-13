<template>
  <form @submit.prevent="onSubmit">
    <label for="titleInput">Title</label>
    <input type="text" v-model="title" id="titleInput" />
    <input class="submit-button" type="submit" value="Create" />
  </form>
</template>

<script>
export default {
  name: "ItemFormComponent",
  props: {},
  data: function () {
    return {
      title: "",
    };
  },
  methods: {
    onSubmit() {
      if (this.title != ""){
        this.$emit("submitEvent", this.title);
        this.title = "";
      }
    },
  },
};
</script>