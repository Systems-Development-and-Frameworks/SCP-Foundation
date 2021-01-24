import { WRONG_CREDENTIALS } from '../plugins/api.js'
import { SET_USER_ID, SET_TOKEN, SET_LOADING } from './store.js'
import jwt_decode from 'jwt-decode'

export const state = () => ({
  loading: false,
  token: null,
  currentUserId: null,
})

export const getters = {
  loggedIn(state) {
    return !!state.token
  },
  currentUserId(state){
    return state.currentUserId
  },
  token(state) {
    return state.token
  }
}

export const mutations = {
  [SET_TOKEN](state, token) {
    state.token = token
  },
  [SET_USER_ID](state, userId) {
    state.currentUserId = userId
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
      let tokenDecoded = jwt_decode(token)
      commit(SET_USER_ID, tokenDecoded.userId)
      commit(SET_TOKEN, token)
      commit(SET_LOADING, false)
      return true
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
  cookieLogin({commit}, {token}) {
    let tokenDecoded = jwt_decode(token)
    commit(SET_USER_ID, tokenDecoded.userId)
    commit(SET_TOKEN, token)
  }
}
