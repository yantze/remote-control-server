import Vue from 'vue'
import App from './App.vue'
import VueSocketIO from 'vue-socket.io'
import store from './store'
// import './registerServiceWorker'
import 'bootstrap-custom'
import LongPress from './plugins/LongPress.js'


Vue.config.productionTip = false

Vue.directive('long-press', LongPress({ delay: 800, interval: 0 }))

Vue.use(
  new VueSocketIO({
    // debug: true,
    connection: location.hostname + ':3399',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  }),
)

const vm = new Vue({
  store,
  render: h => h(App),
}).$mount('#app')

// window.$vm = vm
