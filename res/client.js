var Vue = require("vue/dist/vue.js")

Vue.component('cruelWorld', require('./main.vue'))

const app = new Vue({
    el: "#app",
})
