import { UNAUTHORIZED } from '../plugins/api.js'
import { SET_LOADING } from './index.js'

export const state = () => ({
  loading: false
})

export const getters = {
}

export const mutations = {
  [SET_LOADING](state, loading) {
    state.loading = loading
  },
}

export const actions = {
  async getPosts({ commit },{ apollo }) {
    commit(SET_LOADING, true)
    try {
      const posts = await this.$api.posts({ apollo});
      return posts.data;
    } catch (err) {
      if (err.message === UNAUTHORIZED) return false
      throw err
    } finally {
      commit(SET_LOADING, false)
    }
  },

  async vote({ commit },{ postId, voteValue, apollo }) {
    commit(SET_LOADING, true)
    try {
      const post = await this.$api.vote({postId, voteValue, apollo});
      return post.data;
    } catch (err) {
      if (err.message === UNAUTHORIZED) return false
      throw err
    } finally {
      commit(SET_LOADING, false)
    }
  },

  async createPost({commit}, {title, apollo}) {
    commit(SET_LOADING, true)
    try {
      const post = await this.$api.createPost({title, apollo});
      return post.data.write;
    } catch (err) {
      if (err.message === UNAUTHORIZED) return false
      throw err
    } finally {
      commit(SET_LOADING, false)
    }
  }
}
