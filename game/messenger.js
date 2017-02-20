
var Mob = require('./mob');

var Messenger = {
  sockets: {},

  init: function(io, game) {
    Messenger.socket = io;
    Game = game;
    Messenger.socket.on('connection', function(socket) {
      var mob = new Mob();
      Messenger.sockets[mob.id] = socket;

      socket.on('disconnect', function() {
        Mob.remove(mob.id);
      });
      socket.on('chat', function(msg) {
        Messenger.sendToAll('chat', msg);
      });
    });
  },

  sendToAll: function(type, msg) {
    Messenger.socket.emit(type, msg);
  }
};

module.exports = Messenger;
