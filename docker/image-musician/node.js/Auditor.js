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
let timeout = new Map();

s.on('message', (msg, source) => {
  const musician = JSON.parse(msg);

  if (!musicians.get(musician.uuid)) {
    console.log(musician);
    musicians.set(musician.uuid, musician);
    timeout.set(musician.uuid, 1);
  }

  timeout.set(musician.uuid, 1);
});

function t() {
  timeout.forEach((value, key, map) => {
    if (value < 5) {
      timeout.set(key, value + 1);
    } else if (value >= 5) {
      timeout.delete(key);
      musicians.delete(key);
      console.clear();
      let m = [];
      musicians.forEach((value, key, map) => {
        m.push(value);
      });
      console.log(JSON.stringify(m));
    }
  });
}

setInterval(t, 1000);

// TCP Server

const server = net.createServer((socket) => {
  let m = [];
  musicians.forEach((value, key, map) => {
    m.push(value);
  });
  socket.write(JSON.stringify(m));
  socket.end();
});

server.listen(2205);
