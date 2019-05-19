import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Socket info
    isConnected: false,
    socketMessage: null,

    // Home page tab index
    selectedInputType: null,
  },

  mutations: {
    SOCKET_connect(state) {
      state.isConnected = true
    },
    SOCKET_disconnect(state) {
      state.isConnected = false
    },
    SOCKET_messageChannel(state, message) {
      state.socketMessage = message
    },

    // tslint:disable-next-line: no-shadowed-variable
    updateSelectedInputType(state, { type }) {
      state.selectedInputType = type
    },
  },

  actions: {},
})
