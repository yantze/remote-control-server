<template>
  <div
    v-show="options.selectedInputType=='trackPad'"
    ref="trackPad"
    class="h-100"
    @touchmove.prevent="touchMove"
  ></div>
</template>

<script lang="ts">
export default {
  name: 'TrackPad',
  data() {
    return {
      info: 'hahahahha',
    }
  },
}
</script>

