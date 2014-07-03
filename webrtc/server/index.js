var ip = require('ip');
var port = 9000;

var PeerServer = require('peer').PeerServer;
var server = new PeerServer({port: port, allow_discovery: true});

server.on('connection', function (id) {
  console.log('new connection with id ' + id);
});

server.on('disconnect', function (id) {
  console.log('disconnect with id ' + id);
});

console.log('peer server running on ' + ip.address() + ':' + port);
