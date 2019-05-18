<template>
  <div id="app" class="h-100">
    <Main/>
  </div>
</template>

<script lang="ts">
import Main from './components/Main.vue'

export default {
  name: 'app',
  components: {
    Main,
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
