var socket = null
var server = null
var io = null

exports.socketIO = app => {
  server = require('http').createServer(app)
  io = require('socket.io')(server)

  io.on('connection', function(client) {
    console.log('connected')
    socket = client
    client.on('disconnect', function() {
      console.log('user disconnected')
    })
  })
  return server
}
