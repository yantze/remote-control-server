// tslint:disable
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const memento = store => {
  store.commit('restoreMemento', JSON.parse(localStorage.getItem('memento') || '{}'))
  if (store.getters && 'memento' in store.getters) {
    store.watch(
      (_, getter) => getter['memento'],
      mementoWatch => {
        localStorage.setItem('memento', JSON.stringify(mementoWatch))
      },
    )
  }
}

const store = new Vuex.Store({
  state: {
    // Socket info
    isConnected: false,
    socketMessage: null,

    // Home page tab index
    selectedInputType: null,
  },

  getters: {
    memento: state => {
      const memento = {}
      if (state.selectedInputType) {
        // tslint:disable-next-line
        memento['selectedInputType'] = state.selectedInputType
      }
      return memento
    },
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

    restoreMemento(state, memento) {
      if ('selectedInputType' in memento) {
        // tslint:disable-next-line
        state.selectedInputType = memento['selectedInputType']
      }
    },
  },

  actions: {},

  plugins: [memento],
})

export default store
