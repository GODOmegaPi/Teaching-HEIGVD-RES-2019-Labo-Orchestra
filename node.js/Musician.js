var protocol = require('./protocol');
var uuid = require('uuid/v4')

var dgram = require('dgram');
var s = dgram.createSocket('udp4');

function Musician(instrument, song) {

	this.instrument = instrument;
  this.song = song;
  this.uuid = uuid();

	Musician.prototype.update = function() {

		var musician = {
			uuid: this.uuid,
			instrument: this.instrument,
      activeSince: new Date().toISOString()
		};
		var payload = JSON.stringify(musician);

		message = new Buffer(payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + s.address().port);
		});

	}

	setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];
var song = "";

switch(instrument){
  case "piano": song = "ti-ta-ti"; break;
  case "trumpet": song = "pouet"; break;
  case "flute": song = "trulu"; break;
  case "violin": song = "gzi-gzi"; break;
  case "drum": song = "boum-boum"; break;
}

if(song !== ""){
  var m1 = new Musician(instrument, song);
}
