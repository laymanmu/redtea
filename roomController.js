
var RoomController = {

  getRoom: function(name) {
    return {name:name, desc:'Pitch black.', mobs:[], items:[], gates:[]};
  },

  remoteUserFromRoom: function(user, room) {
  }

};

module.exports = RoomController;
