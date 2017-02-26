
var Mob     = require('./mob');
var Room    = require('./room');
var Gate    = require('./gate');
var Indexer = require('./indexer');
var Game    = require('./game');

var Messenger = {
  sockets: {},

  init: function(io) {
    Messenger.socket = io;
    Messenger.socket.on('connection', function(socket) {
      var mob    = new Mob();
      var roomId = Indexer.getMobsRoomId(mob.id);
      Messenger.sockets[mob.id] = socket;
      Messenger.sendToOne(mob.id, 'user', mob);
      Messenger.sendToAll('chat', `welcome, ${mob.name}`);
      Messenger.sendToRoom(roomId, 'room', Room.getFullRoomMessage(roomId));
      socket.on('disconnect', function() {
        Messenger.sendToAll('chat', `goodbye, ${mob.name}`);
        Mob.remove(mob.id);
        delete Messenger.sockets[mob.id];
        Messenger.sendToRoom(roomId, 'room', Room.getFullRoomMessage(roomId));
      });
      socket.on('chat', function(msg) { Messenger.onChat(mob.id, msg); });
      socket.on('cd',   function(msg) { Messenger.onCd(mob.id, msg);   });
    });
  },

  onChat: function(mobId, msg) {
    Messenger.sendToAll('chat', msg);
  },

  onCd: function(mobId, msg) {
    var mob         = Mob.get(mobId);
    var gate        = Gate.get(msg.gateId);
    var roomId      = Indexer.getMobsRoomId(mob.id);
    var roomGateIds = Indexer.getGateIdsInRoom(roomId);
    for (let roomGateId of roomGateIds) {
      var roomGate = Gate.get(roomGateId);
      if (roomGate.id == gate.id) {
        var nextRoomId = Indexer.getNextRoomId(gate.id, mob.id);
        Indexer.moveMob(mob.id, nextRoomId);
        Messenger.sendToRoom(roomId,     'room', Room.getFullRoomMessage(roomId));
        Messenger.sendToRoom(nextRoomId, 'room', Room.getFullRoomMessage(nextRoomId));
      }
    }
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
