<template>
  <div>
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button class="upvote-button" @click="updateItem(item, 1)">Upvote</button>
    <button class="downvote-button" @click="updateItem(item, -1)">
      Downvote
    </button>
    <button
      class="remove-button"
      @click="removeItem(item)"
      v-if="loggedInAndOwner()"
    >
      Remove
    </button>
    <button class="edit-button" v-if="loggedInAndOwner()">Edit</button>
  </div>
</template>

<script>
import Item from "../../classes/item";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "ItemComponent",
  props: {
    item: Item,
  },
  computed: {
    ...mapGetters("auth", ["loggedIn"]),
    ...mapGetters("auth", ["currentUserId"]),
  },
  methods: {
    ...mapActions('posts', ['vote']),
    
    removeItem(item) {
      this.$emit("removeEvent", item);
    },

    async updateItem(item, value) {
      if (this.loggedIn) {
        const currentVotes = item.getVotes();
        let post = await this.vote({postId: item.id, voteValue: value, apollo: this.$apollo});
        item.setVotes(post.vote.voteResult);
        this.$emit("updateEvent", item);
      } else {
        this.$router.push("/login");
      }
    },

    loggedInAndOwner() {
      if (this.loggedIn) {
        if (this.item.author.id == this.currentUserId) {
          return true;
        }
      }

      return false;
    },
  },
};
</script>

<style>
</style>

