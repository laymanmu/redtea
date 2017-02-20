
var RoomController = require('./roomController');
var MobController  = require('./mobController');

var MessageController = {

  init: function(io) {
    MessageController.socket = io;

    MessageController.socket.on('connection', function(socket) {
      var mob = MobController.createMob(socket);
      MessageController.sendToAll('chat', `hello, ${mob.name}`);

      RoomController.addMobToRoom(mob, {name:'Starting Room'})

      mob.socket.on('disconnect', function() {
        MessageController.sendToAll('chat', `goodbye, ${mob.name}`);
        RoomController.removeMobFromRoom(mob.name);
        MobController.deleteMob(mob.name);
      });

      mob.socket.on('chat', function(msg) {
        MessageController.sendToAll('chat', `${mob.name} says: ${msg}`);
      });
    });
  },

  sendToMob: function(mobName, type, msg) {
    var mob = MobController.mobs[mobName];
    if (mob) {
      console.log(mob);
      mob.socket.emit(type, msg);
    } else {
      console.log(`sendToMob() mobName does not exist: ${mobName}`);
    }
  },

  sendToAll: function(type, msg) {
    MessageController.socket.emit(type, msg);
  }
};

module.exports = MessageController;
