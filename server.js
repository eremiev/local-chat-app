// Setup basic express server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});

var clients = 0;

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  clients++;
  //Send message to all.
  io.sockets.emit('chat message', clients + ' clients connected!');
  //Send message to current connected client.
  socket.emit('chat message','Hey, welcome!');
  //Send message to other clients.
  socket.broadcast.emit('chat message', 'One client is joining.')

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
     io.emit('chat message', msg);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    clients--;
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

