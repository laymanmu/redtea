
var rname = require('node-random-name');

var UserController = {
  users: {},
  createUser: function(socket) {
    var user = {name:rname(), socket:socket};
    UserController.users[user.name] = user;
  }
};

module.exports = UserController;
