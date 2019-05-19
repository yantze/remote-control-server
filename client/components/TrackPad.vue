<template>
  <div ref="trackPad" class="h-100" @touchmove.prevent="touchMove"></div>
</template>

<script lang="ts">
//     v-show="options.selectedInputType=='trackPad'"
export default {
  name: 'TrackPad',
  data() {
    return {
      info: 'hahahahha',
    }
  },
  methods: {
    handleTrackPad(ref) {
      const manager = new Hammer.Manager(ref)

      const OneTap = new Hammer.Tap({
        event: 'onetap',
        taps: 1,
      })

      // Add the recognizer to the manager
      manager.add(OneTap)

      // Subscribe to the desired event
      manager.on('onetap', e => {
        //  e.target.classList.toggle('expand');
        console.log('one tap')
        this.$socket.emit('WS_MOUSE_CLICK', { button: 'left', double: false })
      })

      const TwoTap = new Hammer.Tap({
        event: 'twotap',
        pointers: 2,
      })

      // Add the recognizer to the manager
      manager.add(TwoTap)

      // Subscribe to the desired event
      manager.on('twotap', e => {
        //  e.target.classList.toggle('expand');
        console.log('two tap')
        this.$socket.emit('WS_MOUSE_CLICK', { button: 'right', double: false })
      })

      const TwoPan = new Hammer.Pan({
        pointers: 2,
        threshold: 5,
        event: 'twopan',
        direction: Hammer.DIRECTION_ALL,
      })
      manager.add(TwoPan)
      manager.on('twopan', ev => {
        console.log('two pan move')
        if (this.lastPosition.length !== 2) {
          // console.log("first");
          this.lastPosition = [ev.deltaX, ev.deltaY]
          // console.log("last:", lastPosition);
          return
        }
        if (ev.isFinal) {
          this.lastPosition = []
          // console.log("final");
        }
        const distanceX = ev.deltaX - this.lastPosition[0]
        const distanceY = ev.deltaY - this.lastPosition[1]
        this.$socket.emit('WS_MOUSE_MOVE', {
          x: distanceX * 0.5,
          y: distanceY * 0.5,
          scroll: true,
        })
      })
    },
  },
}
</script>

