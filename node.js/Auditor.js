// UDP Server
const dgram = require('dgram');
const net = require('net');

const s = dgram.createSocket('udp4');
const protocol = require('./protocol');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

let musicians = [];

s.on('message', (msg, source) => {
  const musician = JSON.parse(msg);
  let i;

  let found = false;
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

function timeout() {
  musicians = [];
  console.clear();
}

setInterval(timeout, 5000);

// TCP Server

const server = net.createServer((socket) => {
  socket.write(JSON.stringify(musicians));
  socket.destroy();
});

server.listen(2205, '127.0.0.1');
