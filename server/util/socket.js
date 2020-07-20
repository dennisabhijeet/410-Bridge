var socket = null
var server = null
var io = null

exports.socketIO = (app) => {
  server = require('http').createServer(app)
  io = require('socket.io')(server)

  io.on('connection', function (client) {
    socket = client
    client.on('disconnect', function () {})
  })
  return server
}
