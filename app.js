
var port    = 3000;
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var logger  = require('morgan');

require('./messageController').init(io);

app.use(express.static('ui'));
app.use(logger('dev'));

http.listen(port, function() {
  console.log("listening on *:"+ port);
});
