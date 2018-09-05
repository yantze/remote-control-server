'use strict'
const http = require('../server/app.js')
const os = require('os')

module.exports = function ({ port }) {
    port = port || 3399
    const ifaces = os.networkInterfaces()
    http.listen(port, function () {
        Object.keys(ifaces).forEach(ifname =>
            ifaces[ifname].forEach(iface =>
                console.log('listening on', iface.address, 'and port', port)))
    })
}
