
var Mob     = require('./mob');
var Room    = require('./room');
var Indexer = require('./indexer');
var Game    = require('./game');

var Messenger = {
  sockets: {},

  init: function(io) {
    Messenger.socket = io;
    Messenger.socket.on('connection', function(socket) {
      var mob = new Mob();
      Messenger.sockets[mob.id] = socket;
      socket.emit('room', Room.getFullRoom());

      socket.on('disconnect', function() {
        Mob.remove(mob.id);
        delete Messenger.sockets[mob.id];
      });
      socket.on('chat', function(msg) {
        Messenger.sendToAll('chat', msg);
      });
    });
  },

  sendToOne: function(mobId, type, msg) {
    if (Messenger.sockets[mobId]) {
      Messenger.sockets[mobId].emit(type, msg);
    }
  },

  sendToAll: function(type, msg) {
    Messenger.socket.emit(type, msg);
  }
};

module.exports = Messenger;
