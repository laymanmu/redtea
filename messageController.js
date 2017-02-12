
var RoomController = require('./roomController');
var UserController = require('./userController');

var MessageController = {

  init: function(io) {
    MessageController.socket = io;

    MessageController.socket.on('connection', function(socket) {
      var user = UserController.createUser(socket);
      var room = RoomController.getRoom('Starting Room');

      MessageController.sendToUser(user, 'room', room);
      MessageController.sendToAll('chat', `hello, ${user.name}`);

      user.socket.on('disconnect', function() {
        MessageController.sendToAll('chat', `goodbye, ${user.name}`);
        RoomController.removeUserFromRoom(user, room);
        UserController.deleteUser(user);
      });

      user.socket.on('chat', function(msg) {
        MessageController.sendToAll('chat', `${user.name} says: ${msg}`);
      })
    });
  },

  sendToUser: function(user, type, msg) {
    user.socket.emit(type, msg);
  },

  sendToAll: function(type, msg) {
    MessageController.socket.emit(type, msg);
  }
};

module.exports = MessageController;
