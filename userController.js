
var rname = require('node-random-name');

var UserController = {
  users: {},

  createUser: function(socket) {
    var user = {name:rname(), socket:socket};
    UserController.users[user.name] = user;
    return user;
  },

  deleteUser: function(user) {
    delete UserController.users[user.name];
  }

};

module.exports = UserController;
