<template>
    <div id="container">
        <div ref="touch" id="touch-area" @touchmove.prevent="touchMove">{{msg}}</div>
        <div id="control" @touchmove.prevent="empty">
            <div id="left-click" v-on:click="leftClick" @dblclick.prevent="leftDoubleClick"></div>
            <div id="middle-click" v-on:click="middleClick" @dblclick.prevent="middleDoubleClick"></div>
            <div id="right-click" v-on:click="rightClick" @dblclick.prevent="rightDoubleClick"></div>
        </div>
    </div>
</template>

<script>
const socket = io(location.origin);
// setInterval(() => {
//     // socket.emit('WS_MOUSE_MOVE', { x: 34, y: 45 })
// }, 3000)

module.exports = {
  //   el: "#container",
  data: function() {
    return {
      input: "# hello",
      msg: "bbb",
      lastTouch: null
    };
  },
  mounted() {},
  methods: {
    empty() {},
    touchMove(event) {
      console.log("event:", event);
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        if (!this.lastTouch) {
          this.lastTouch = touch;
          return;
        }

        let distanceX = touch.clientX - this.lastTouch.clientX;
        let distanceY = touch.clientY - this.lastTouch.clientY;
        socket.emit("WS_MOUSE_MOVE", { x: distanceX, y: distanceY });
        // this.msg = 'good:' + distanceX

        this.lastTouch = touch;
      }
    },
    leftClick(event) {
      socket.emit("WS_MOUSE_CLICK", { button: "left", double: false });
    },
    middleClick(event) {
      socket.emit("WS_MOUSE_CLICK", { button: "middle", double: false });
    },
    rightClick(event) {
      socket.emit("WS_MOUSE_CLICK", { button: "right", double: false });
    },
    leftDoubleClick(event) {
      this.msg = "double click";
      socket.emit("WS_MOUSE_CLICK", { button: "left", double: true });
    },
    middleDoubleClick(event) {
      socket.emit("WS_MOUSE_CLICK", { button: "middle", double: true });
    },
    rightDoubleClick(event) {
      socket.emit("WS_MOUSE_CLICK", { button: "right", double: true });
    }
  }
};
</script>