import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  selectedInputType: null,
}

const mutations = {
  // tslint:disable-next-line: no-shadowed-variable
  updateSelectedInputType(state, { type }) {
    state.selectedInputType = type
  },
}

const actions = {}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
})

export default store
