
var Messenger = {

  init: function() {
    Messenger.socket = io();
    Messenger.socket.on('chat', Messenger.onChat);
    Messenger.socket.on('room', Messenger.onRoom);
  },

  onChat: function(msg) {
    Client.print(msg);
  },

  onRoom: function(room) {
    console.log(`onRoom room: ${JSON.stringify(room)}`)

    var toList = function(klass, values) {
      var html = "";
      for (var i=0; i<values.length; i++) {
        html += `<span class='${klass}'>${values[i]}</span>`;
        if (i<values.length-1)  html += ', ';
      }
      return html;
    };

    Client.ui.roomName.innerHTML  = room.name;
    Client.ui.roomDesc.innerHTML  = room.desc;
    Client.ui.roomItems.innerHTML = `items: ${toList('roomItem', room.items)}`;
    Client.ui.roomMobs.innerHTML  = `mobs:  ${toList('roomMob',  room.mobs)}`;
    Client.ui.roomGates.innerHTML = `gates: ${toList('roomGate', room.gates)}`;
  }

};
