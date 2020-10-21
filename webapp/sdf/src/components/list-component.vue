<template>
  <div>
    <h1>News List</h1>

    <div v-for="(item, index) in sortedArray" :key="index">
      <ItemComponent
        :item="item"
        @removeEvent="removeItem"
        @updateEvent="updateItem"
      />
    </div>
      <ItemFormComponent @submitEvent="onSubmit"/>
    <div>
      
    </div>
  </div>
</template>

<script>
import ItemComponent from "./item-component.vue";
import ItemFormComponent from "./item-form-component.vue";
import Item from "../classes/item";

export default {
  name: "List",
  components: {
    ItemComponent,
    ItemFormComponent
  },
  data: function () {
    return {
      itemList: [new Item(1, "Eintrag1"), new Item(2, "Eintrag2")],
    };
  },
  methods: {
    removeItem(item) {
      this.itemList = this.itemList.filter((i) => {
        return item.id !== i.id;
      });
    },

    updateItem(item) {
      this.itemList = this.itemList.map((i) => {
        return item.id === i.id ? item : i;
      });
    },

    onSubmit(newTitle) {
      var biggestId = Math.max.apply(
        Math,
        this.itemList.map((item) => {
          return item.id;
        })
      );
      const newId = biggestId + 1;
      this.itemList.push(new Item(newId, newTitle));
    },
  },
  computed: {
    sortedArray() {
      var newArray = [...this.itemList];
      return newArray.sort((a, b) => b.votes - a.votes);
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

