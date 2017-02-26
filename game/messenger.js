
var Mob     = require('./mob');
var Room    = require('./room');
var Indexer = require('./indexer');
var Game    = require('./game');

var Messenger = {
  sockets: {},

  init: function(io) {
    Messenger.socket = io;
    Messenger.socket.on('connection', function(socket) {
      var mob     = new Mob();
      var roomId  = Indexer.getMobsRoomId(mob.id);
      Messenger.sockets[mob.id] = socket;
      Messenger.sendToAll('chat', `welcome, ${mob.name}`);
      Messenger.sendToRoom(roomId, 'room', Room.getFullRoomMessage(roomId));
      socket.on('disconnect', function() {
        Mob.remove(mob.id);
        delete Messenger.sockets[mob.id];
        Messenger.sendToAll('chat', `goodbye, ${mob.name}`);
        Messenger.sendToRoom(roomId, 'room', Room.getFullRoomMessage(roomId));
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
  },

  sendToRoom: function(roomId, type, msg) {
    var mobIds = Indexer.getMobIdsInRoom(roomId);
    for (let mobId of mobIds) {
      Messenger.sendToOne(mobId, type, msg);
    }
  }
};

module.exports = Messenger;
