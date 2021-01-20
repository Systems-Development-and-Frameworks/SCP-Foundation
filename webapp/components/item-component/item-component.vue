<template>
  <div>
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button class="upvote-button" @click="updateItem(item, 1)">Upvote</button>
    <button class="downvote-button" @click="updateItem(item, -1)">Downvote</button>
    <button class="remove-button" @click="removeItem(item)">Remove</button>
  </div>
</template>

<script>
import Item from "../../classes/item";
export default {
  name: "ItemComponent",
  props: {
    item: Item,
  },
  methods: {
    removeItem(item) {
      this.$emit("removeEvent", item);
    },

    updateItem(item, value) {
      const currentVotes = item.getVotes()
      item.setVotes(currentVotes + value)
      this.$emit("updateEvent", item);
    },
  },
};
</script>

<style>
</style>

