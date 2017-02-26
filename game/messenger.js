
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
      socket.on('chat',   function(msg) { Messenger.on_chat(mob.id, msg);   });
      socket.on('cd',     function(msg) { Messenger.on_cd(mob.id, msg);     });
      socket.on('mkroom', function(msg) { Messenger.on_mkroom(mob.id, msg); });
    });
  },

  on_chat: function(mobId, msg) {
    Messenger.sendToAll('chat', msg);
  },

  on_cd: function(mobId, msg) {
    var status = {from:"cd", result:true, messages:[]};
    Messenger.checkForParm("gateId", msg, status);
    if (!status.result) {
      Messenger.sendToOne(mobId, status);
      return;
    }
    var mob         = Mob.get(mobId);
    var gate        = Gate.get(msg.gateId);
    var roomId      = Indexer.getMobsRoomId(mobId);
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

  on_mkroom: function(mobId, msg) {
    console.log(`got mkroom msg: ${JSON.stringify(msg)}`);
    var status = {from:"mkroom", result:true, messages:[]};
    Messenger.checkForParm("roomName", msg, status);
    Messenger.checkForParm("roomDesc", msg, status);
    if (!status.result) {
      Messenger.sendToOne(mobId, 'status', status);
      return;
    }
    var roomId  = Indexer.getMobsRoomId(mobId);
    var newRoom = new Room(msg.roomName, msg.roomDesc);
    var newGate = new Gate(roomId, newRoom.id);
    Messenger.sendToRoom(roomId,     'room', Room.getFullRoomMessage(roomId));
    Messenger.sendToRoom(newRoom.id, 'room', Room.getFullRoomMessage(newRoom.id));
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
  },

  checkForParm: function(parmName, data, statusMsg) {
    if (!data[parmName] || data[parmName].length<1) {
      statusMsg.result = false;
      statusMsg.messages.push(`missing parm: ${parmName}`);
    }
  }
};

module.exports = Messenger;
