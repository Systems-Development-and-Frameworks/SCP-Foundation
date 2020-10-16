<template>
  <div>
    <h1>News List</h1>

    <div v-for="(item, index) in sortedArray" :key="index">
      <ItemComponent
        v-bind:item="item"
        @removeEvent="removeItem"
        @updateEvent="updateItem"
      />
    </div>

    <div>
      <form @submit.prevent="onSubmit">
        <input type="text" v-model="newTitle" />
        <input type="submit" value="Create" />
      </form>
    </div>
  </div>
</template>

<script>
import ItemComponent from "./item-component.vue";
import Item from "../classes/item";

export default {
  name: "List",
  components: {
    ItemComponent,
  },
  data: function () {
    return {
      itemList: [new Item("Test12"), new Item("Test")],
      newTitle: "",
    };
  },
  methods: {
    removeItem: function (item) {
      const index = this.itemList.indexOf(item);
      this.itemList.splice(index, 1);
    },
    updateItem: function (item, value) {
      const index = this.itemList.indexOf(item);
      this.itemList[index].votes += value;
    },
    onSubmit: function () {
      this.itemList.push(new Item(this.newTitle));
      this.newTitle = "";
    },
  },
  computed: {
    sortedArray: function () {
      var newArray = [...this.itemList];

      return newArray.sort((a, b) => {
        if (a.votes > b.votes) return -1;
        if (a.votes < b.votes) return 1;
        return 0;
      });
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

