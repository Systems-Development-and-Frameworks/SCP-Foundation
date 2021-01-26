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

    <ItemFormComponent @submitEvent="onSubmit" v-if="loggedIn" />
    <div></div>
  </div>
</template>

<script>
import ItemComponent from "../item-component/item-component";
import ItemFormComponent from "../item-form-component/item-form-component";
import Item from "../../classes/item";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "List",
  components: {
    ItemComponent,
    ItemFormComponent,
  },
  data: function () {
    return {
      itemList: [],
      orderAscending: true,
    };
  },
  async created() {
    await this.getPostIterable();
  },
  methods: {
    ...mapActions("posts", ["getPosts"]),
    ...mapActions("posts", ["createPost"]),

    async getPostIterable() {
      let postList = await this.getPosts({ apollo: this.$apollo });
      if (postList.posts && postList.posts.length > 0) {
        this.itemList = postList.posts.map(
          (p) => new Item(p.id, p.title, p.voteResult, p.author)
        );
      }
    },

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

    async onSubmit(newTitle) {
      let newPost = await this.createPost({
        title: newTitle,
        apollo: this.$apollo,
      });
      if (newPost)
        this.itemList.push(
          new Item(
            newPost.id,
            newPost.title,
            newPost.voteResult,
            newPost.author
          )
        );
    },
  },
  computed: {
    sortedArray() {
      var newArray = [...this.itemList];
      return newArray.sort((a, b) => {
        if (this.orderAscending) return b.votes - a.votes;
        else return a.votes - b.votes;
      });
    },
    ...mapGetters("auth", ["loggedIn"]),
  },
};
</script>

<style>
</style>

