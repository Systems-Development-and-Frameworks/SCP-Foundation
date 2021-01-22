import { SET_LOADING } from './store.js'

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
      const posts = await this.$api.posts({ apollo})
    } catch (err) {
      if (err.message === WRONG_CREDENTIALS) return false
      throw err
    } finally {
      commit(SET_LOADING, false)
    }
  },
}
