
var Messenger = {

  init: function() {
    Messenger.socket = io();
    Messenger.socket.on('chat', Messenger.onChat);
    Messenger.socket.on('room', Messenger.onRoom);
  },

  onChat: function(msg) {
    Client.print(msg);
  },

  onRoom: function(msg) {
    for (key in msg) {
      var element = "room";
      switch(key) {
        case "name":  element += "Name";break;
        case "desc":  element += "Desc";break;
        case "gates": element += "Gates";break;
        case "mobs":  element += "Mobs";break;
        case "items": element += "Items";break;
      }
      Client.ui[element].innerHTML = msg[key];
    }
  }

};
