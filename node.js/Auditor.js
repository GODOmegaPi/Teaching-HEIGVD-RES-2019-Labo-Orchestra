// UDP Server
const dgram = require('dgram');

const s = dgram.createSocket('udp4');
const protocol = require('./protocol');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

var musicians = [];

s.on('message', function(msg, source) {
  var musician = JSON.parse(msg);

  var found = false;
  var i;
  for(i = 0; i < musicians.length; i++){
    if(musicians[i].uuid == musician.uuid){
      found = true;
      break;
    }
  }

  if(!found) {
    console.log(musician);
    musicians.push(musician);
  }
});

// TCP Server

var net = require('net');

var server = net.createServer(function(socket) {
	socket.write(JSON.stringify(musicians));
  socket.destroy();
});

server.listen(2205, '127.0.0.1');
