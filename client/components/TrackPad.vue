<template>
  <div ref="trackPad" class="h-100" @touchmove.prevent="touchMove" v-long-press="onLongPress"></div>
</template>

<script lang="ts">
import Hammer from 'hammerjs'
import _ from 'lodash'

const mousePos = {
  clientX: 0,
  clientY: 0,
  timestamp: Date.now(),
}

export default {
  name: 'TrackPad',
  data() {
    return {
      lastPosition: [],
      longPressEnable: false,
    }
  },
  created() {
    this.moveThrottle = _.throttle(this.move, 10)
  },
  mounted() {
    this.handleTrackPad(this.$refs.trackPad)
  },
  methods: {
    move(touch) {
      const distanceX = touch.clientX - mousePos.clientX
      const distanceY = touch.clientY - mousePos.clientY
      this.$socket.emit(this.longPressEnable ? 'WS_MOUSE_DRAG' : 'WS_MOUSE_MOVE', {
        x: distanceX * 1.5,
        y: distanceY * 1.5,
      })
    },
    touchMove(event) {
      if (event.touches.length === 1) {
        const touch = event.touches[0]

        const now = Date.now()
        const duration = now - mousePos.timestamp

        // console.log('duration:', duration)
        if (duration < 100) {
          this.moveThrottle(touch)
        }

        mousePos.timestamp = now

        mousePos.clientX = touch.clientX
        mousePos.clientY = touch.clientY
      }
    },
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
    onLongPress(ev, { status }) {
      // 这里在触控板上移动，也会触发长按事件
      let change = false
      if (status === 'start' && this.longPressEnable !== true) {
        this.longPressEnable = true
        change = true
      }
      if (status === 'end' && this.longPressEnable !== false) {
        this.longPressEnable = false
        change = true
      }
      if (change) {
        console.log('Mouse Toggle:', this.longPressEnable)
        this.$socket.emit('WS_MOUSE_TOGGLE', { button: 'left', pressed: this.longPressEnable })
      }
    },
  },
}
</script>

