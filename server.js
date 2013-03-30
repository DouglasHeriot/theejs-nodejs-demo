var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(8080); // listen for websockets on port 8080

var blocks = [];
var users = {};
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
            
        socket.on('blockSize', function(data){
            data.id = socket.id;
            socket.broadcast.emit('blockSize', data);
            });
		
        socket.on('clear', function(data){
			blocks = [];
			socket.broadcast.emit('clear', {});
			});

		//This is the new section to handle the chat window
		socket.on('newUser', function(username){
		
			//Store the username in the socket, so we know who this user is from now on
			socket.user = username;
			
			//Store the username in the global user's list
			users.username = username;
			
		});
		socket.on('newMessage', function(message){
			//Broadcast the message to all other users, along with the username of the originator
			socket.broadcast.emit('updateChat', socket.user, message);
			
			//Broadcast it to our user
			socket.emit('updateChat', socket.user, message);
		});
		
		socket.on('userDisconnect', function(){	
			//Now that the user has disconnected we need to remove them from the global list
			delete users[socket.user];
		});
		//chatWindow section end
		
		// Send current array of blocks when first connecting
		socket.emit('blocks', blocks);

		});

