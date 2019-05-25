<template>
  <div class="d-flex flex-column h-100" @touchmove.prevent="empty">
    <div
      id="input-type"
      class="d-flex justify-content-center align-items-center"
      style="height: 111px;"
    >
      <div class="dropdown pl-4">
        <button
          tabindex="-1"
          class="btn"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img class src="/img/more.svg" alt="Switch to control">
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <button
            class="btn btn-light dropdown-item"
            @click="updateSelectInputType('transfer')"
            href="#"
          >Transfer</button>
          <button
            class="btn btn-light dropdown-item"
            @click="updateSelectInputType('help')"
            href="#"
          >Help</button>
        </div>
      </div>
      <div class="w-100 d-flex justify-content-center">
        <button class="btn btn-light nav-btn" @click="updateSelectInputType('trackPad')">
          <img style="width: 30px;" class src="/img/trackpad.svg" alt="Switch to trackpad">
          <small class="d-block">Track pad</small>
        </button>
        <button class="btn btn-light nav-btn" @click="updateSelectInputType('simpleKeyboard')">
          <img style="height: 27px;" class src="/img/control.svg" alt="Switch to control">
          <small class="d-block">Functions</small>
        </button>
      </div>
    </div>
    <div class="flex-height-expand">
      <TrackPad v-show="selectedInputType == 'trackPad'"></TrackPad>
      <SimpleKeyboard v-show="selectedInputType == 'simpleKeyboard'"></SimpleKeyboard>
      <Transfer v-show="selectedInputType == 'transfer'"></Transfer>
      <div v-show="selectedInputType=='help'" id="help">
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
      <div v-if="selectedInputType=='keyboardOriginal'" id="keyboard-original">
        <input type="password" value=" " style="ime-mode: disabled">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import TrackPad from './TrackPad.vue'
import Transfer from './Transfer.vue'
import SimpleKeyboard from './SimpleKeyboard.vue'

export default {
  components: {
    TrackPad,
    Transfer,
    SimpleKeyboard,
  },
  computed: {
    ...mapState(['selectedInputType']),
  },
  methods: {
    empty() {},
    updateSelectInputType(type) {
      this.$store.commit('updateSelectedInputType', { type })
    },
  },
}
</script>

<style scoped>
.nav-btn {
  width: 122px;
  height: 58px;
}
</style>
