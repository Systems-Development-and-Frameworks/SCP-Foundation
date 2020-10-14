<template>
  <div>
    <h2>{{title}} ({{votes}})</h2>
    <button>Upvote</button>
    <button>Downvote</button>
    <button v-on:click="removeItem(title)">Remove</button>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    title: String,
    votes: Number
  },
  methods: {
    removeItem: function(_title) {
        this.$emit('removeEvent', _title)
    }
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
</style>

