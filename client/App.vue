<template>
  <div id="app" class="h-100">
    <Main/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Main from './components/Main.vue'

export default Vue.extend({
  name: 'app',
  components: {
    Main,
  },
})
</script>

<style>

html, body {
  /* margin: 0;
  padding: 0; */
  background-color: #F2F2F2;

  touch-action: manipulation;
  overflow:hidden;
  -webkit-app-region: no-drag;

}

/* =========== Library: Layout ============= */

.flex-expand {
  flex: 1;
}

.flex-column {
  flex-direction: column;
}

.flex {
  display: flex;
}


</style>
