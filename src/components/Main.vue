<template>
    <div id="container">
        <div id="input-type" @touchmove.prevent="empty">
          <button class="pure-button" @click="selectInputType('trackPad')">
              <img class="" src="/img/trackpad.svg" alt="switch to trackpad"/>
          </button>
          <button class="pure-button keyboard-control" @click="selectInputType('keyboardSimple')">
              <img class="" src="/img/control.svg" alt="switch to control"/>
          </button>
        </div>
        <div v-show="options.selectedInputType=='trackPad'" ref="trackPad" id="trackpad" @touchmove.prevent="touchMove"></div>
        <div v-show="options.selectedInputType=='keyboardSimple'" id="keyboard-simple" @touchmove.prevent="empty">
          <div id="direction-control">
            <div class="direction-row">
              <button class="pure-button" @click="clickUp">
                <img class="direction-img" src="/img/direction.svg" alt="Up"/>
              </button>
            </div>
            <div class="direction-row">
              <button class="pure-button" @click="clickLeft">
                <img class="direction-img rotate270" src="/img/direction.svg" alt="Left"/>
              </button>
              <button class="pure-button" @click="clickDown">
                <img class="direction-img rotate180" src="/img/direction.svg" alt="Down"/>
              </button>
              <button class="pure-button" @click="clickRight">
                <img class="direction-img rotate90" src="/img/direction.svg" alt="Right"/>
              </button>
            </div>
          </div>

          <div id="function-control">
            <div class="row">
              <button class="pure-button" @click="clickVolMute">静音</button>
              <button class="pure-button" @click="clickVolDown">音量-</button>
              <button class="pure-button" @click="clickVolUp">音量+</button>
            </div>

            <!-- <div class="row">
              <button class="pure-button" @click="clickAudioPrev">向后</button>
              <button class="pure-button" @click="clickAudioPlay">播放</button>
              <button class="pure-button" @click="clickAudioNext">向前</button>
            </div> -->

            <div class="row">
              <button class="pure-button" @click="clickSpace">Space</button>
              <button class="pure-button" @click="clickEsc">Esc</button>
            </div>

            <div class="row">
              <button class="pure-button" @click="clickTab">Tab</button>
              <button class="pure-button" @click="clickEnter">Enter</button>
            </div>
          </div>

          <!-- <div id="log">{{log}}</div> -->
        </div>
        <div v-if="options.selectedInputType=='keyboardOriginal'" id="keyboard-original">
            <input type="password" value=" " style="ime-mode: disabled"/>
        </div>
        <!-- <div id="keyboard">
            <div id="keyboard-type">
                <div id="instant-keyboard">
                </div>
            </div>
        </div> -->
        <!-- <div id="control" @touchmove.prevent="empty">
            <div id="left-click" v-on:click="leftClick" @dblclick.prevent="leftDoubleClick"></div>
            <div id="middle-click" v-on:click="middleClick" @dblclick.prevent="middleDoubleClick"></div>
            <div id="right-click" v-on:click="rightClick" @dblclick.prevent="rightDoubleClick"></div>
        </div> -->
    </div>
</template>

<script lang="ts">
import Hammer from 'hammerjs'
import io from 'socket.io-client'
import Vue from 'vue'

// const socket = io(location.origin)
const socket = io(location.hostname + ':3399')
const mousePos = {
  clientX: 0,
  clientY: 0,
  timestamp: Date.now(),
}

export default Vue.extend({
  //   el: "#container",
  data() {
    return {
      input: '# hello',
      msg: 'bbb',
      lastPosition: [],
      options: {
        selectedInputType: 'keyboardSimple',
      },
    }
  },
  created() {
    this.initOptions()
  },
  mounted() {
    if (this.$refs.trackPad) {
      this.handleTrackPad(this.$refs.trackPad)
    }
  },
  methods: {
    empty() {},
    touchMove(event) {
      //   console.log("event:", event);
      if (event.touches.length === 1) {
        const touch = event.touches[0]
        const now = Date.now()
        const duration = mousePos.timestamp - now

        mousePos.timestamp = now
        mousePos.clientX = touch.clientX
        mousePos.clientY = touch.clientY

        if (duration > 100) {
          return
        }

        const distanceX = touch.clientX - mousePos.clientX
        const distanceY = touch.clientY - mousePos.clientY
        socket.emit('WS_MOUSE_MOVE', {
          x: distanceX * 1.5,
          y: distanceY * 1.5,
        })
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
        socket.emit('WS_MOUSE_CLICK', { button: 'left', double: false })
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
        socket.emit('WS_MOUSE_CLICK', { button: 'right', double: false })
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
        socket.emit('WS_MOUSE_MOVE', {
          x: distanceX * 0.5,
          y: distanceY * 0.5,
          scroll: true,
        })
      })
    },
    selectInputType(type) {
      this.setOptions({
        selectedInputType: type,
      })
    },
    clickUp() {
      socket.emit('WS_KEY_PRESS', { code: 38 })
    },
    clickDown() {
      socket.emit('WS_KEY_PRESS', { code: 40 })
    },
    clickLeft() {
      socket.emit('WS_KEY_PRESS', { code: 37 })
    },
    clickRight() {
      socket.emit('WS_KEY_PRESS', { code: 39 })
    },
    clickSpace() {
      socket.emit('WS_KEY_PRESS', { code: 32 })
    },
    clickEsc() {
      socket.emit('WS_KEY_PRESS', { code: 27 })
    },
    clickTab() {
      socket.emit('WS_KEY_PRESS', { code: 9 })
    },
    clickEnter() {
      socket.emit('WS_KEY_PRESS', { code: 13 })
    },
    clickVolMute() {
      socket.emit('WS_KEY_PRESS', { code: 101 })
    },
    clickVolDown() {
      socket.emit('WS_KEY_PRESS', { code: 102 })
    },
    clickVolUp() {
      socket.emit('WS_KEY_PRESS', { code: 103 })
    },
    clickAudioPrev() {
      socket.emit('WS_KEY_PRESS', { code: 108 })
    },
    clickAudioPlay() {
      socket.emit('WS_KEY_PRESS', { code: 104 })
    },
    clickAudioNext() {
      socket.emit('WS_KEY_PRESS', { code: 109 })
    },
    clickAudioPlayOrPause() {
      socket.emit('WS_KEY_PRESS', { code: 106 })
    },

    leftClick(event) {
      socket.emit('WS_MOUSE_CLICK', { button: 'left', double: false })
    },
    middleClick(event) {
      socket.emit('WS_MOUSE_CLICK', { button: 'middle', double: false })
    },
    rightClick(event) {
      socket.emit('WS_MOUSE_CLICK', { button: 'right', double: false })
    },
    leftDoubleClick(event) {
      this.msg = 'double click'
      socket.emit('WS_MOUSE_CLICK', { button: 'left', double: true })
    },
    middleDoubleClick(event) {
      socket.emit('WS_MOUSE_CLICK', { button: 'middle', double: true })
    },
    rightDoubleClick(event) {
      socket.emit('WS_MOUSE_CLICK', { button: 'right', double: true })
    },
    initOptions() {
      const options = this.getOptions()
      if (options) {
        this.options = options
      }
    },
    getOptions() {
      const optionsStringify = localStorage.getItem('options')
      let options = null
      try {
        options = JSON.parse(optionsStringify)
      } catch (err) {
        throw err
      }
      return options
    },
    setOptions(options) {
      Object.assign(this.options, options)
      return localStorage.setItem('options', JSON.stringify(this.options))
    },
  },
})
</script>

<style scoped>
#trackpad {
  display: flex;
  flex: 1;
}

#keyboard {
  display: flex;
  height: 200px;
  outline: 1px solid red;
}

@media screen and (min-width: 425px) {
  #keyboard-simple {
    display: flex;
  }

  #direction-control {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .direction-row button.pure-button {
    padding: 2px 4px;
  }
}

#instant-keyboard {
  height: 200px;
  width: 200px;
  outline: 1px solid red;
}

#instant-keyboard input {
  outline: 1px solid blue;
}

#input-type {
  position: absolute;
  top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

#input-type button {
  width: 122px;
  height: 68px;
  padding-top: 13px;
}

#input-type .keyboard-control img {
  /* padding: 5px; */
  vertical-align: super;
}

.direction-row {
  display: flex;
  justify-content: center;
}

.row {
  display: flex;
  justify-content: space-around;
  margin: 15px;
}

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

.direction-row button {
  background: transparent;
  padding: 0;
  margin: 0;
  height: 76px;
}

.direction-row .direction-img {
  padding: 30px;
}

.direction-row button:active {
  /* background: black; */
  background: linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.1)
  );
}
</style>
