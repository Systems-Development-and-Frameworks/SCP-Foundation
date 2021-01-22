<template>
  <div>
    <h1>News List</h1>
    <button class="toggle-btn" @click="orderAscending = !orderAscending">
      Toggle order
    </button>

    <div v-if="sortedArray.length > 0">
      <div v-for="(item, index) in sortedArray" :key="index">
        <ItemComponent
          :item="item"
          @removeEvent="removeItem"
          @updateEvent="updateItem"
        />
      </div>
    </div>
    <div v-else>
      <h2 class="list-empty">The list is empty!</h2>
    </div>


    <ItemFormComponent @submitEvent="onSubmit" v-if="loggedIn"/>
    <div></div>
  </div>
</template>

<script>
import ItemComponent from "../item-component/item-component";
import ItemFormComponent from "../item-form-component/item-form-component";
import Item from "../../classes/item";
import { mapGetters, mapActions } from "vuex"

export default {
  name: "List",
  components: {
    ItemComponent,
    ItemFormComponent,
  },
  data: function () {
    return {
      itemList: [new Item(1, "Eintrag1"), new Item(2, "Eintrag2")],
      orderAscending: true,
    };
  },
  created () {
    console.log("Created")
    this.getPosts({apollo:this.$apollo})
  },
  methods: {
    ...mapActions('posts', ['getPosts']),
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
      return newArray.sort((a, b) => {
        if (this.orderAscending)
          return b.votes - a.votes
        else
          return a.votes - b.votes
      });
    },
    ...mapGetters('auth', ['loggedIn']),
  },
};
</script>

<style>
</style>

