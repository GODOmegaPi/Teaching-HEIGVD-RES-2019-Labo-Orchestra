// UDP Server
const dgram = require('dgram');
const net = require('net');

const s = dgram.createSocket('udp4');
const protocol = require('./protocol');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

const musicians = [];

s.on('message', (msg, source) => {
  const musician = JSON.parse(msg);

  let found = false;
  let i;
  for (i = 0; i < musicians.length; i++) {
    if (musicians[i].uuid === musician.uuid) {
      found = true;
      break;
    }
  }

  if (!found) {
    console.log(musician);
    musicians.push(musician);
  }
});

// TCP Server

const server = net.createServer((socket) => {
  socket.write(JSON.stringify(musicians));
  socket.destroy();
});

server.listen(2205, '127.0.0.1');
