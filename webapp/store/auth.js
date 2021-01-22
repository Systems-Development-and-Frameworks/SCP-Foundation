import { WRONG_CREDENTIALS } from '../plugins/api.js'
import { SET_USER, SET_TOKEN, SET_LOADING } from './store.js'

export const state = () => ({
  loading: false,
  token: null,
  currentUser: null,
})

export const getters = {
  loggedIn(state) {
    return !!state.token
  },
}

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token
  },
  [SET_USER](state, user) {
    state.currentUser = user
  },
  [SET_LOADING](state, loading) {
    state.loading = loading
  },
}

export const actions = {
  async login({ commit },{ email, password, apollo}) { 
    commit(SET_LOADING, true)
    try {
      const { token } = await this.$api.login({ email, password, apollo})
      commit(SET_TOKEN, token)
    } catch (err) {
      if (err.message === WRONG_CREDENTIALS) return false
      throw err
    } finally {
      commit(SET_LOADING, false)
    }
  },
  logout({ commit }) {
    commit(SET_TOKEN, null)
  },
}
