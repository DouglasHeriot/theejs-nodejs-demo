var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(8080);

server.listen(9001);

app.configure(function(){
		app.use(express.static(__dirname + '/static'));
		});

app.get('/', function (req, res) {
		res.sendfile(__dirname + '/index.html');
		});

io.sockets.on('connection', function (socket) {
		console.log("Connection from " + socket.id);

		socket.on('move', function(data){
			data.id = socket.id;
			socket.broadcast.emit('move', data);
			});

		socket.on('place', function(data){
			data.id = socket.id;
			socket.broadcast.emit('place', data);
			});
		});

