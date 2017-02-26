
var Messenger = {

  init() {
    Messenger.socket = io();
    Messenger.socket.on('chat', Messenger.onChat);
    Messenger.socket.on('room', Messenger.onRoom);
    Messenger.socket.on('user', Messenger.onUser);
  },

  sendMsg(type, msg) {
    Messenger.socket.emit(type, msg);
  },

  onChat(msg) {
    Client.print(msg);
  },

  onUser(msg) {
    Client.user = msg;
    Client.print(`got user msg: ${JSON.stringify(msg)}`);
  },

  onStatus(msg) {
    Client.print(msg);
  },

  onRoom(room) {
    Client.room = room;

    var itemNames = [];
    var mobNames  = [];
    var gateNames = [];

    for (let mob of room.mobs) {
      mobNames.push(mob.name);
    }
    for (let gate of room.gates) {
      gateNames.push(gate.name);
    }

    Client.ui.roomName.innerHTML  = room.name;
    Client.ui.roomDesc.innerHTML  = room.desc;
    Client.ui.roomItems.innerHTML = `items: ${Messenger.toList('roomItem', itemNames)}`;
    Client.ui.roomMobs.innerHTML  = `mobs:  ${Messenger.toList('roomMob',  mobNames)}`;
    Client.ui.roomGates.innerHTML = `gates: ${Messenger.toList('roomGate', gateNames)}`;
  },

  toList(klass, values) {
    var html = "";
    for (var i=0; i<values.length; i++) {
      html += `<span class='${klass}'>${values[i]}</span>`;
      if (i<values.length-1)  html += ', ';
    }
    return html;
  }
};
