// Setup basic express server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});

var clients = 0;
var roomno = 1;
var users= {};

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('Create socket connection.');
  console.log(users);
  let count = Object.keys(users).length  + 1;
  //Send message to all.
  io.sockets.emit('server-message', count + ' clients online!');
  //Send message to current connected client.
  socket.emit('server-message','Hey, welcome!');
  //Send message to other clients.
  socket.broadcast.emit('server-message', 'One client is joining.')

    socket.on('setUsername', function(data){
    var vals = Object.keys(users).map(function(key) {
      return users[key];
    });
    if (vals.indexOf(data) > -1) {
      console.log('Username exist.');
      socket.emit('userExists', 'Username \"' + data + '\" is taken! Try some other username.');
    } else {
      users[socket.id] = data;
      socket.emit('userSet', {username: data});
    }
    })

  socket.on('chat-message', function(data){
    console.log('user:' + data.username +  ' message: ' + data.msg);
     io.emit('chat-message', data);
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    if(users.hasOwnProperty(socket.id)){
      delete users[socket.id];
    } else {
      console.log('Socket not found for disconect.')
    }
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

