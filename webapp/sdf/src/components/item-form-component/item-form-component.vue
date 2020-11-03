<template>
  <form @submit.prevent="onSubmit">
    <input type="text" v-model="title" />
    <input type="submit" value="Create" />
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
      this.$emit("submitEvent", this.title);
      this.title = "";
    },
  },
};
</script>