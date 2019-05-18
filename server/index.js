const express = require('express')
const app = express()
const path = require('path')
const os = require('os')

const http = require('http').Server(app)
const io = require('socket.io')(http)
const robot = require('robotjs')

const handleSocket = require('./socket.js')

// Upload server
const tus = require('tus-node-server')
const tusServer = new tus.Server()
tusServer.datastore = new tus.FileStore({
    directory: path.join(__dirname, '..', 'dist', 'files'),
    // relativeLocation: true,
    path: '/files',
})
app.use('/uploads', tusServer.handle.bind(tusServer))

app.use(express.static(path.resolve(__dirname, '../dist')))

io.on('connection', socket => handleSocket(socket, robot))

/**
 *
 * @param {} param0
 * @returns net.Server
 */
function startServer({ port } = {}) {
    port = port || 3399
    const ifaces = os.networkInterfaces()
    return http.listen(port, function() {
        Object.keys(ifaces).forEach(ifname =>
            ifaces[ifname].forEach(iface => console.log('listening on', iface.address, 'and port', port)),
        )
    })
}

module.exports = {
    start: startServer,
}
