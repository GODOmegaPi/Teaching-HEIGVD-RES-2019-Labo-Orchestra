// UDP Server
const dgram = require('dgram');
const net = require('net');

const s = dgram.createSocket('udp4');
const protocol = require('./protocol');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

let musicians = new Map();

s.on('message', (msg, source) => {
  const musician = JSON.parse(msg);

  if (!musicians.get(musician.uuid)) {
    console.log(musician);
    musicians.set(musician.uuid, musician);
  }
});

function timeout() {
  musicians = new Map();
  console.clear();
}

setInterval(timeout, 5000);

// TCP Server

const server = net.createServer((socket) => {
  musicians.forEach((value, key, map) => {
    socket.write(JSON.stringify(value));
  });
  socket.end();
});

server.listen(2205);
