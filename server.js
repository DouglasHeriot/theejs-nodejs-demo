var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(8080);

server.listen(9001);

app.configure(function(){
		app.use(express.static(__dirname + '/static'));
		});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.on('move', function(data){
	  socket.broadcast.emit('move', data);
	  });

});


