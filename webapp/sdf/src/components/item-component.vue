<template>
  <div>
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button v-on:click="updateItem(item, 1)">Upvote</button>
    <button @click="updateItem(item, -1)">Downvote</button>
    <button v-on:click="removeItem(item)">Remove</button>
  </div>
</template>

<script>
import Item from "../classes/item";
export default {
  name: "ItemComponent",
  props: {
    item: Item,
  },
  methods: {
    removeItem: function (_item) {
      this.$emit("removeEvent", _item);
    },

    updateItem: function (_item, value) {
      this.$emit("updateEvent", _item, value);
    },
  },
};
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
</style>

