<template>
    <div id="container">
        <div ref="trackPad" id="touch-area" @touchmove.prevent="touchMove">{{msg}}</div>
        <div id="keyboard">
            <div id="keyboard-type">
                <div id="instant-keyboard">
                    <input type="password" value=" " style="ime-mode: disabled"/>
                </div>
            </div>
        </div>
        <!-- <div id="control" @touchmove.prevent="empty">
            <div id="left-click" v-on:click="leftClick" @dblclick.prevent="leftDoubleClick"></div>
            <div id="middle-click" v-on:click="middleClick" @dblclick.prevent="middleDoubleClick"></div>
            <div id="right-click" v-on:click="rightClick" @dblclick.prevent="rightDoubleClick"></div>
        </div> -->
    </div>
</template>

<script>
const Hammer = require("hammerjs/hammer.js");

const socket = io(location.origin);
// setInterval(() => {
//   socket.emit("WS_MOUSE_MOVE", { x: 50, y: 0, scroll: true });
// }, 2000);

module.exports = {
  //   el: "#container",
  data: function() {
    return {
      input: "# hello",
      msg: "bbb",
      lastTouch: null,
      lastPosition: []
    };
  },
  mounted() {
    const manager = new Hammer.Manager(this.$refs.trackPad);

    const OneTap = new Hammer.Tap({
      event: "onetap",
      taps: 1
    });

    // Add the recognizer to the manager
    manager.add(OneTap);

    // Subscribe to the desired event
    manager.on("onetap", function(e) {
      //  e.target.classList.toggle('expand');
      console.log("one tap");
      socket.emit("WS_MOUSE_CLICK", { button: "left", double: false });
    });

    const TwoTap = new Hammer.Tap({
      event: "twotap",
      pointers: 2
    });

    // Add the recognizer to the manager
    manager.add(TwoTap);

    // Subscribe to the desired event
    manager.on("twotap", function(e) {
      //  e.target.classList.toggle('expand');
      console.log("two tap");
      socket.emit("WS_MOUSE_CLICK", { button: "right", double: false });
    });

    const TwoPan = new Hammer.Pan({
      pointers: 2,
      threshold: 5,
      event: "twopan",
      direction: Hammer.DIRECTION_ALL
    });
    manager.add(TwoPan);
    manager.on("twopan", ev => {
      console.log("two pan move");
      if (this.lastPosition.length !== 2) {
        // console.log("first");
        this.lastPosition = [ev.deltaX, ev.deltaY];
        // console.log("last:", lastPosition);
        return;
      }
      if (ev.isFinal) {
        this.lastPosition = [];
        // console.log("final");
      }
      const distanceX = ev.deltaX - this.lastPosition[0];
      const distanceY = ev.deltaY - this.lastPosition[1];
      socket.emit("WS_MOUSE_MOVE", {
        x: distanceX * 0.5,
        y: distanceY * 0.5,
        scroll: true
      });
    });
  },
  methods: {
    empty() {},
    touchMove(event) {
      //   console.log("event:", event);
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
    keyboardInput(event) {
      const alt = event.altKey || false;
      const ctrl = event.ctrlKey || false;
      const shift = event.shiftKey || false;
      const meta = event.metaKey || false;
      const code = event.which || event.keyCode;
      const string = event.target.value;
      event.target.value = "";
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