const uuid = require('uuid/v4');
const dgram = require('dgram');

const s = dgram.createSocket('udp4');
const protocol = require('./protocol');

function Musician(instrument, song, startTime) {
  this.instrument = instrument;
  this.song = song;
  this.uuid = uuid();

  Musician.prototype.update = function update() {
    const musician = {
      uuid: this.uuid,
      instrument: this.instrument,
      activeSince: startTime,
    };
    const payload = JSON.stringify(musician);

    const message = new Buffer(payload);
    s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, (err, bytes) => {
      console.log('Sending payload:' + payload + ' via port ' + s.address().port);
    });
  }
  setInterval(this.update.bind(this), 1000);
}

const instrument = process.argv[2];
let song = '';

switch (instrument) {
  case 'piano': song = 'ti-ta-ti'; break;
  case 'trumpet': song = 'pouet'; break;
  case 'flute': song = 'trulu'; break;
  case 'violin': song = 'gzi-gzi'; break;
  case 'drum': song = 'boum-boum'; break;
  default: song = 'error;';
}

if (song !== '') {
  const m1 = new Musician(instrument, song, new Date().toISOString());
}
