export default ({ delay = 400, interval = 50 }) => ({
    bind: function(el, binding, vNode) {
        if (typeof binding.value !== 'function') {
            const compName = vNode.context.name
            let warn = `[LongPress:] provided expression '${binding.expression}' is not a function, but has to be`
            if (compName) {
                warn += `Found in component '${compName}' `
            }
            console.warn(warn)
        }

        let pressTimer = null
        let pressInterval = null
        let startTimeStamp = Date.now()

        const start = ev => {
            if (ev.type === 'click' && ev.button !== 0) {
                return
            }

            startTimeStamp = Date.now()
            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    if (interval && interval > 0) {
                        pressInterval = setInterval(() => {
                            handler(ev, { status: 'interval' })
                        }, interval)
                    }
                    handler(ev, { status: 'start' })
                }, delay)
            }
        }

        // Cancel Timeout
        const cancel = ev => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer)
                pressTimer = null
                handler(ev, { status: 'end' })
            }
            if (pressInterval) {
                clearInterval(pressInterval)
                pressInterval = null
                handler(ev, { status: 'intervalEnd' })
            }
        }

        // Run Function
        function handler(ev, payload) {
            binding.value(ev, payload)
        }

        ['mousedown', 'touchstart'].forEach(ev => el.addEventListener(ev, start))
        ;['click', 'mouseout', 'touchend', 'touchcancel'].forEach(ev => el.addEventListener(ev, cancel))
        ;['touchmove'].forEach(ev =>
            el.addEventListener(ev, e => {
                if (Date.now() - startTimeStamp < delay) {
                    cancel(e)
                }
            }),
        )
    },
})
