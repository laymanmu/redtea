
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
      Messenger.socket.emit('chat', `welcome, ${mob.name}`);

      var roomId  = Indexer.getMobsRoomId(mob.id);
      var mobIds  = Indexer.getMobIdsInRoom(roomId);
      var roomMsg = Room.getFullRoomMessage(roomId);

      for (let mobId of mobIds) {
        Messenger.sendToOne(mobId, 'room', roomMsg);
      }

      socket.on('disconnect', function() {
        Mob.remove(mob.id);
        Messenger.socket.emit('chat', `goodbye, ${mob.name}`);
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
