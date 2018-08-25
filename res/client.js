
const socket = io(location.origin)
// setInterval(() => {
//     // socket.emit('WS_MOUSE_MOVE', { x: 34, y: 45 })
// }, 3000)

const template = `<div id="container" @touchmove="touchMove">
{{msg}}
</div>`

new Vue({
    el: '#container',
    template,
    data: {
        input: '# hello',
        msg: 'bbb',
        lastTouch: null
    },
    methods: {
        touchMove(event) {
            console.log('event:', event)
            if (event.touches.length === 1) {
                const touch = event.touches[0]

                if (!this.lastTouch) {
                    this.lastTouch = touch
                    return
                }

                let distanceX = touch.clientX - this.lastTouch.clientX
                let distanceY = touch.clientY - this.lastTouch.clientY
                socket.emit('WS_MOUSE_MOVE', { x: distanceX, y: distanceY })
                this.msg = 'good:' + distanceX

                this.lastTouch = touch
            }
        }
    }
})