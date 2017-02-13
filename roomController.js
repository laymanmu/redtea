
var db = require('./db');
var MobController = require('./mobController');

var RoomController = {

  findRoom: function(query, callback) {
    db.find('room', query, function(results) {
      if (callback) callback(results[0]);
    });
  },

  addMobToRoom: function(enteringMob, roomFindQuery) {
    RoomController.findRoom(roomFindQuery, function(room) {
      room.mobs.push(enteringMob.name);
      MobController.mobs[enteringMob.name].room_id = room._id;
      db.upsert('room', room, function() {
        RoomController.sendRoomToMobs(room);
      });
    });
  },

  removeMobFromRoom: function(mobName) {
    var mob = MobController.mobs[mobName];
    if (!mob) return;
    var roomQuery = {_id:mob.room_id};
    RoomController.findRoom(roomQuery, function(room) {
      var index = room.mobs.indexOf(mob);
      if (index > -1) {
        room.mobs = room.mobs.splice(index, 1);
        db.upsert('room', room, function() {
          RoomController.sendRoomToMobs(room);
        });
      }
    });
  },

  sendRoomToMobs: function(room) {
    room.mobs.forEach(function(mobName) {
      var mob = MobController.mobs[mobName];
      if (mob) {
        mob.socket.emit('room', room);
      } else {
        console.log(`sendRoomToMobs() room ${room.name} has a mob that doesn't exist: ${mobName}`);
      }
    });
  }

};

module.exports = RoomController;
