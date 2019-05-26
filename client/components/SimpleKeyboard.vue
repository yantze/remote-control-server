<template>
  <div>
    <div class="container h-100">
      <div class="row my-3">
        <div class="col">
          <button
            v-long-press="onLongPress"
            class="btn btn-light btn-block mx-auto"
            @click="clickKey('up')"
          >
            <img class="direction-img rotate270" src="/img/direction.svg" alt="Up">
          </button>
        </div>
      </div>
      <div class="row my-4">
        <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('left')">
            <img class="direction-img rotate180" src="/img/direction.svg" alt="Left">
          </button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('down')">
            <img class="direction-img rotate90" src="/img/direction.svg" alt="Down">
          </button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('right')">
            <img class="direction-img" src="/img/direction.svg" alt="Right">
          </button>
        </div>
      </div>

      <div class="row my-4">
        <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('volMute')">Mute</button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('volDown')">Vol-</button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('volUp')">Vol+</button>
        </div>
      </div>

      <!-- <div class="row">
            <button class="btn btn-light" @click="clickAudioPrev">向后</button>
            <button class="btn btn-light" @click="clickAudioPlay">播放</button>
            <button class="btn btn-light" @click="clickAudioNext">向前</button>
      </div>-->

      <div class="row my-4">
        <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('tab')">Tab</button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('esc')">Esc</button>
        </div>
      </div>

      <div class="row">
        <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('enter')">Enter</button>
          <button v-long-press="onLongPress" class="btn btn-light" @click="clickKey('space')">Space</button>
        </div>
      </div>

      <!-- <div id="log">{{log}}</div> -->
    </div>
  </div>
</template>

<script lang="ts">
const keyMap = {
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  space: 32,
  esc: 27,
  tab: 9,
  enter: 13,
  volMute: 101,
  volDown: 102,
  volUp: 103,
  audioPrev: 108,
  audioPlay: 104,
  audioNext: 109,
  audioPlayOrPause: 106,
}

export default {
  data() {
    return {
      bigKey: '',
      bigEl: null,
    }
  },
  methods: {
    onLongPress(ev, { status }) {
      if (status !== 'start') {
        return
      }

      let el = ev.target
      if (el.tagName !== 'BUTTON') {
        if (el.parentElement.tagName === 'BUTTON') {
          el = ev.target.parentElement
        } else {
          return
        }
      }

      if (el.classList.contains('bigKey')) {
        el.classList.remove('bigKey')
        this.bigEl = null
      } else {
        this.bigEl = el
        el.classList.add('bigKey')
      }
    },
    keyboardInput(event) {
      const alt = event.altKey || false
      const ctrl = event.ctrlKey || false
      const shift = event.shiftKey || false
      const meta = event.metaKey || false
      const code = event.which || event.keyCode
      const keyValue = event.target.value
      event.target.value = ''
    },
    clickKey(key) {
      const keyCode = keyMap[key]
      this.$socket.emit('WS_KEY_PRESS', { code: keyCode })
    },

    leftClick(event) {
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'left', double: false })
    },
    middleClick(event) {
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'middle', double: false })
    },
    rightClick(event) {
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'right', double: false })
    },
    leftDoubleClick(event) {
      this.msg = 'double click'
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'left', double: true })
    },
    middleDoubleClick(event) {
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'middle', double: true })
    },
    rightDoubleClick(event) {
      this.$socket.emit('WS_MOUSE_CLICK', { button: 'right', double: true })
    },
  },
}
</script>

<style scoped>
.row button {
  width: 122px;
  height: 51px;
}

.rotate90 {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.rotate180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.rotate270 {
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  -o-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.bigKey {
  position: fixed;
  width: 93% !important;
  height: inherit !important;
  top: 107px;
  bottom: 20px;
  z-index: 1;
}
</style>
