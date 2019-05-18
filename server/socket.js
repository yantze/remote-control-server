const c = require('./constants')
const Immutable = require('seamless-immutable')
const clipboard = require('clipboardy')

const KEY_MAPPING = Immutable({
    9: 'tab',
    8: 'backspace',
    13: 'enter',
    27: 'escape',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space',

    101: 'audio_mute',
    102: 'audio_vol_down',
    103: 'audio_vol_up',
    // 104: 'audio_play', // 官方文档的内容失效
    105: 'audio_stop',
    // 106: 'audio_play_or_stop', // 不存在需要自己判断
    107: 'audio_pause',
    108: 'audio_prev',
    109: 'audio_next',
})

const pressedToState = {
    true: 'down',
    false: 'up',
}

module.exports = function(socket, robot) {
    function moveMouse({ x, y }) {
        const pos = robot.getMousePos()
        robot.moveMouse(pos.x + x, pos.y + y)
    }

    function scrollMouse({ x, y }) {
    // y = y > 0 ? 1 : -1
        robot.scrollMouse(x, y)
    }

    socket.on(c.WS_MOUSE_MOVE, ({ x, y, scroll }) => {
        if (!scroll) {
            moveMouse({ x, y })
            return
        }
        scrollMouse({ x, y })
    })

    socket.on(c.WS_MOUSE_CLICK, ({ button, double }) => {
        robot.mouseClick(button, double)
    })

    socket.on(c.WS_KEY_PRESS, action => {
        let alt = action.alt
        let ctrl = action.ctrl
        let shift = action.shift
        let meta = action.meta
        let code = action.code
        let string = action.string

        if (alt) robot.keyToggle('alt', 'down')
        if (ctrl) robot.keyToggle('control', 'down')
        if (shift) robot.keyToggle('shift', 'down')
        if (meta) robot.keyToggle('command', 'down')

        let specialKey = KEY_MAPPING[code]
        if (string) {
            robot.typeString(string)
        } else if (specialKey) {
            // console.log('specialKey:', specialKey)
            robot.keyTap(specialKey)
        } else {
            // Hack for android where key code is always 229. We use the backspace
            // when the string is empty.
            robot.keyTap('backspace')
        }

        if (alt) robot.keyToggle('alt', 'up')
        if (ctrl) robot.keyToggle('control', 'up')
        if (shift) robot.keyToggle('shift', 'up')
        if (meta) robot.keyToggle('command', 'up')
        return false
    })

    socket.on(c.WS_KEY_TOGGLE, ({ key, pressed }) => {
        const state = pressedToState[!!pressed]
        if (key === 'meta') key = 'command'
        robot.keyToggle(key, state)
    })

    socket.on(c.WS_MOUSE_TOGGLE, ({ button, pressed }) => {
        const state = pressedToState[!!pressed]
        robot.mouseToggle(state, button)
    })

    socket.on(c.WS_CLIPBOARD_PULL, (cb) => {
        // socket.emit('active push', {aa: 'aa'})
        if (typeof cb === 'function') clipboard.read().then(cb)
    })

    socket.on(c.WS_CLIPBOARD_PUSH, ({data}, cb) => {
        if (data) clipboard.write(data)
        if (typeof cb === 'function') cb()
    })
}

module.exports.KEY_MAPPING = KEY_MAPPING
