<template>
  <div class="d-flex flex-column h-100">
    <div
      id="input-type"
      class="d-flex justify-content-center align-items-center"
      style="height: 111px;"
      @touchmove.prevent="empty"
    >
      <button class="btn btn-light nav-btn" @click="toggleHelp">?</button>
      <button class="btn btn-light nav-btn" @click="selectInputType('trackPad')">
        <img class src="/img/trackpad.svg" alt="Switch to trackpad">
      </button>
      <button class="btn btn-light nav-btn" @click="selectInputType('keyboardSimple')">
        <img class src="/img/control.svg" alt="Switch to control">
      </button>
      <button class="btn btn-light nav-btn" @click="selectInputType('transfer')">
        <img class src="/img/control.svg" alt="Switch to transfer">
      </button>
    </div>
    <div class="flex-height-expand">
      <div
        v-show="options.selectedInputType=='trackPad'"
        ref="trackPad"
        class="h-100"
        @touchmove.prevent="touchMove"
      ></div>
      <div
        v-show="options.selectedInputType=='keyboardSimple'"
        class="container h-100"
        @touchmove.prevent="empty"
      >
        <div class="row my-3">
          <div class="col">
            <button class="btn btn-light btn-block mx-auto" @click="clickKey('up')">
              <img class="direction-img rotate270" src="/img/direction.svg" alt="Up">
            </button>
          </div>
        </div>
        <div class="row my-4">
          <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
            <button class="btn btn-light" @click="clickKey('left')">
              <img class="direction-img rotate180" src="/img/direction.svg" alt="Left">
            </button>
            <button class="btn btn-light" @click="clickKey('down')">
              <img class="direction-img rotate90" src="/img/direction.svg" alt="Down">
            </button>
            <button class="btn btn-light" @click="clickKey('right')">
              <img class="direction-img" src="/img/direction.svg" alt="Right">
            </button>
          </div>
        </div>

        <div class="row my-4">
          <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
            <button class="btn btn-light" @click="clickKey('volMute')">Mute</button>
            <button class="btn btn-light" @click="clickKey('volDown')">Vol-</button>
            <button class="btn btn-light" @click="clickKey('volUp')">Vol+</button>
          </div>
        </div>

        <!-- <div class="row">
            <button class="btn btn-light" @click="clickAudioPrev">向后</button>
            <button class="btn btn-light" @click="clickAudioPlay">播放</button>
            <button class="btn btn-light" @click="clickAudioNext">向前</button>
        </div>-->

        <div class="row my-4">
          <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
            <button class="btn btn-light" @click="clickKey('tab')">Tab</button>
            <button class="btn btn-light" @click="clickKey('esc')">Esc</button>
          </div>
        </div>

        <div class="row">
          <div class="offset-lg-2 col-lg-8 d-flex justify-content-around">
            <button class="btn btn-light" @click="clickKey('enter')">Enter</button>
            <button class="btn btn-light" @click="clickKey('space')">Space</button>
          </div>
        </div>

        <!-- <div id="log">{{log}}</div> -->
      </div>
      <div v-show="options.selectedInputType=='transfer'" class="container">
        <label>{{ tips }}</label>

        <div class="row">
          <div class="col">
            <div class="form-group">
              <textarea name="clipboard" class="form-control" rows="2" v-model="clipboard"></textarea>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col d-flex">
            <button class="btn btn-light" @click="sendClipboard">Send</button>
            <button class="btn btn-light" @click="reciveClipboard">Recive</button>
            <button class="btn btn-light" @click="clipboard = ''">Clear</button>
          </div>
        </div>

        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-link"
          data-toggle="modal"
          data-target="#exampleModal"
        >Launch demo modal</button>

        <!-- Modal -->
        <div
          class="modal fade"
          id="exampleModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">...</div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h5>autoProceed is on</h5>

          <!-- Target DOM node #1 -->
          <div class="UppyDragDrop-One"></div>

          <!-- Progress bar #1 -->
          <div class="UppyDragDrop-One-Progress"></div>
        </div>
      </div>
      <div v-show="options.selectedInputType=='help'" id="help">
        <ul>
          <li>触控板按钮:空白界面，通过手指滑动来移动指针, 支持手势。</li>
          <li>遥控按钮:常用的按键。</li>
          <li>
            可以去
            <a href="https://github.com/yantze/remote-control-server/issues">这里</a> 反馈
          </li>
          <li>
            或者给我发送邮件
            <a href="mailto:yantze@126.com">yantze@126.com</a>
          </li>
        </ul>
      </div>
      <div v-if="options.selectedInputType=='keyboardOriginal'" id="keyboard-original">
        <input type="password" value=" " style="ime-mode: disabled">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Hammer from 'hammerjs'
import io from 'socket.io-client'
import Vue from 'vue'
import _ from 'lodash'

import { Uppy } from '@uppy/core'
import DragDrop from '@uppy/drag-drop'
import ProgressBar from '@uppy/progress-bar'
import Tus from '@uppy/tus'

import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import '@uppy/progress-bar/dist/style.css'

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
  data() {
    return {
      input: '# hello',
      msg: 'bbb',
      clipboard: '',
      lastPosition: [],
      lastSelected: 'keyboardSimple',
      options: {
        selectedInputType: 'keyboardSimple',
      },
      tips: '',
    }
  },
  created() {
    this.initOptions()
    this.moveThrottle = _.throttle(this.move, 10)

    // socket.on('active push', (...args) => {
    //   console.log('----------------:', ...args)
    // })
  },
  mounted() {
    if (this.$refs.trackPad) {
      this.handleTrackPad(this.$refs.trackPad)
    }
    const uppyOne = new Uppy({ autoProceed: true })
    uppyOne
      .use(DragDrop, { target: '.UppyDragDrop-One' })
      .use(Tus, { endpoint: `${location.origin}/uploads` })
      .use(ProgressBar, {
        target: '.UppyDragDrop-One-Progress',
        hideAfterFinish: true,
      })

    uppyOne.on('complete', result => {
      if (result.successful.length > 0) {
        const items = result.successful.map(item => {
          const fileId = item.uploadURL.slice(item.uploadURL.lastIndexOf('/') + 1)
          return {
            url: `${location.origin}/files/${fileId}`,
          }
        })
        console.log('items:', items)
      } else {
        console.log('failed files:', result.failed)
      }
    })
  },
  methods: {
    empty() {},
    move(touch) {
      const distanceX = touch.clientX - mousePos.clientX
      const distanceY = touch.clientY - mousePos.clientY
      socket.emit('WS_MOUSE_MOVE', {
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
    sendClipboard() {
      socket.emit(
        'WS_CLIPBOARD_PUSH',
        {
          data: this.clipboard,
        },
        () => {
          this.tips = 'Success'
        },
      )
    },
    reciveClipboard() {
      socket.emit('WS_CLIPBOARD_PULL', data => {
        this.clipboard = data
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
.nav-btn {
  width: 122px;
  height: 68px;
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
</style>
