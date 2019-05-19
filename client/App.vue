<template>
  <div id="app" class="h-100">
    <Main/>
  </div>
</template>

<script lang="js">
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main,
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    customEmit(data) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)', data)
    },
  },
}
</script>

<style>
html,
body {
  background-color: #f2f2f2;

  touch-action: manipulation;
  overflow: hidden;
  -webkit-app-region: no-drag;
}
</style>
