var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(8080); // listen for websockets on port 8080

var blocks = [];

// Listen on port 9001
server.listen(9001);

app.configure(function(){
		// Serve static files from 'static' directory
		// eg. request for /js/blockbuilder.js is found in static/js/blockbuilder.js
		app.use(express.static(__dirname + '/static'));
		});

app.get('/', function (req, res) {
		res.sendfile(__dirname + '/index.html');
		});

io.sockets.on('connection', function (socket) {

		socket.on('move', function(data){
			data.id = socket.id;
			socket.broadcast.emit('move', data);
			});

		socket.on('place', function(data){
			// Tag with socket connection id
			data.id = socket.id;

			// Send to all clients
			socket.broadcast.emit('place', data);

			// Save block
			blocks.push(data);
			});

		socket.on('clear', function(data){
			blocks = [];
			socket.broadcast.emit('clear', {});
			});

		// Send current array of blocks when first connecting
		socket.emit('blocks', blocks);

		});

