
var port    = 3000;
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var logger  = require('morgan');
var Game    = require('./game/game');

Game.init(io);

app.use(express.static('client'));
app.use(logger('dev'));

http.listen(port, function() {
  console.log("listening on *:"+ port);
  Game.start();
});
