<template>
    <div class="flex flex-column flex-expand">
        <div id="input-type" @touchmove.prevent="empty">
          <button class="pure-button" @click="selectInputType('trackPad')">
              <img class="" src="/img/trackpad.svg" alt="Switch to trackpad"/>
          </button>
          <button class="pure-button keyboard-control" @click="selectInputType('keyboardSimple')">
              <img class="" src="/img/control.svg" alt="Switch to control"/>
          </button>
          <button class="pure-button" id="help-button" @click="toggleHelp" alt="Display help page"> ? </button>
        </div>
        <div id="main" class="flex flex-column flex-expand">
          <div v-show="options.selectedInputType=='trackPad'" ref="trackPad"
            id="trackpad" class="flex flex-column flex-expand" @touchmove.prevent="touchMove"></div>
          <div v-show="options.selectedInputType=='keyboardSimple'"
            id="keyboard-simple" class="flex flex-column flex-expand" @touchmove.prevent="empty">
            <div id="direction-control">
              <div class="direction-row">
                <button class="pure-button" @click="clickKey('up')">
                  <img class="direction-img rotate270" src="/img/direction.svg" alt="Up"/>
                </button>
              </div>
              <div class="direction-row">
                <button class="pure-button" @click="clickKey('left')">
                  <img class="direction-img rotate180" src="/img/direction.svg" alt="Left"/>
                </button>
                <button class="pure-button" @click="clickKey('down')">
                  <img class="direction-img rotate90" src="/img/direction.svg" alt="Down"/>
                </button>
                <button class="pure-button" @click="clickKey('right')">
                  <img class="direction-img" src="/img/direction.svg" alt="Right"/>
                </button>
              </div>
            </div>

            <div id="function-control">
              <div class="row">
                <button class="pure-button" @click="clickKey('volMute')">静音</button>
                <button class="pure-button" @click="clickKey('volDown')">音量-</button>
                <button class="pure-button" @click="clickKey('volUp')">音量+</button>
              </div>

              <!-- <div class="row">
                <button class="pure-button" @click="clickAudioPrev">向后</button>
                <button class="pure-button" @click="clickAudioPlay">播放</button>
                <button class="pure-button" @click="clickAudioNext">向前</button>
              </div> -->

            </div>
            <div id="normal-control" class="flex flex-column">
              <div class="row">
                <button class="pure-button" @click="clickKey('tab')">Tab</button>
                <button class="pure-button" @click="clickKey('esc')">Esc</button>
              </div>

              <div class="row">
                <button class="pure-button" @click="clickKey('enter')">Enter</button>
                <button class="pure-button" @click="clickKey('space')">Space</button>
              </div>
            </div>

            <!-- <div id="log">{{log}}</div> -->
          </div>
          <div v-show="options.selectedInputType=='help'" id="help">
            <ul>
              <li>点击上面的触控板按钮显示空白界面，可以通过手指滑动来移动指针。</li>
              <li>选择上方的控制按钮显示简单的遥控界面</li>
              <li>可以去 <a href="https://github.com/yantze/remote-control-server/issues">这里</a> 反馈</li>
              <li>或者给我发送邮件 <a href="mailto:yantze@126.com">yantze@126.com</a></li>
            </ul>
          </div>
          <div v-if="options.selectedInputType=='keyboardOriginal'" id="keyboard-original">
              <input type="password" value=" " style="ime-mode: disabled"/>
          </div>
        </div>
        <!-- <div id="keyboard">
            <div id="keyboard-type">
                <div id="instant-keyboard">
                </div>
            </div>
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

export default Vue.extend({
  //   el: "#container",
  data() {
    return {
      input: '# hello',
      msg: 'bbb',
      lastPosition: [],
      lastSelected: 'keyboardSimple',
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
        console.log('distance:', distanceX, distanceY)
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
    toggleHelp() {
      if (this.options.selectedInputType === 'help') {
        this.setOptions({
          selectedInputType: this.lastSelected,
        })
      } else {
        this.lastSelected = this.options.selectedInputType
        this.setOptions({
          selectedInputType: 'help',
        })
      }
    },
    clickKey(key) {
      const keyCode = keyMap[key]
      socket.emit('WS_KEY_PRESS', { code: keyCode })
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
#container {
  height: 100vh;
}

#trackpad {
  display: flex;
  flex: 1;
}

#keyboard {
  display: flex;
  height: 200px;
  outline: 1px solid red;
}

#keyboard-simple {
  flex: 1;
  display: flex;
  flex-direction: column;
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
  /* position: absolute; */
  /* top: 20px; */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 110px;
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
  /* background: transparent; */
  margin: 5px;
  padding: 0;
  border-radius: 40px;
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

#help-button {
  width: 30px !important;
  height: 30px !important;
  padding: 0 !important;
  margin: 10px;
  position: absolute;
  left: 10px;
  top: 10px;
  background: transparent;
  font-size: 16px;
  font-weight: bold;
}

#normal-control {
  flex: 1;
  justify-content: center;
}
</style>
