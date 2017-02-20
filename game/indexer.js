
var Indexer = {
  data: {
    mobs:  {},
    rooms: {},
    gates: {}
  },

  addMob(mobId, roomId="1") {
    Indexer.data.mobs[mobId] = {roomId:roomId};
    Indexer.addToList(mobId, Indexer.data.rooms[roomId].mobs);
  },
  removeMob(mobId) {
    var fromRoomId = Indexer.data.mobs[mobId].roomId;
    Indexer.removeFromList(mobId, Indexer.data.rooms[fromRoomId].mobs);
    delete Indexer.data.mobs[mobId];
  },
  moveMob(mobId, toRoomId) {
    if (Indexer.data.mobs[mobId]) {
      if (Indexer.data.mobs[mobId].roomId) {
        var fromRoomId = Indexer.data.mobs[mobId].roomId;
        Indexer.removeFromList(mobId, Indexer.data.rooms[fromRoomId].mobs);
      }
      Indexer.data.mobs[mobId].roomId = toRoomId;
      Indexer.addToList(mobId, Indexer.data.rooms[toRoomId].mobs);
    } else {
      Indexer.addMob(mobId, toRoomId);
    }
  },

  addRoom(roomId) {
    Indexer.data.rooms[roomId] = {mobs:[], gates:[]};
  },
  removeRoom(roomId) {
    for (mobId of Indexer.data.rooms[roomId].mobs) {
      if (Indexer.data.mobs[mobId].roomId == roomId) {
        Indexer.data.mobs[mobId].roomId = 0;
      }
    }
    for (gateId of Indexer.data.rooms[roomId].gates) {
      var roomIds = Indexer.data.gates[gateId].roomIds;
      if (roomIds[0] == roomId) {
        roomIds[0] = 0;
      } else if (roomIds[1] == roomId) {
        roomIds[1] = 0;
      }
    }
  },

  addGate(gateId, roomIds) {
    Indexer.data.gates[gateId] = { roomIds:roomIds };
    Indexer.addToList(gateId, Indexer.data.rooms[roomIds[0]].gates);
    Indexer.addToList(gateId, Indexer.data.rooms[roomIds[1]].gates);
  },
  removeGate(gateId) {
    var roomIds = Indexer.data.gates[gateId].roomIds;
    Indexer.removeFromList(gateId, Indexer.data.rooms[roomIds[0]].gates);
    Indexer.removeFromList(gateId, Indexer.data.rooms[roomIds[1]].gates);
    delete Indexer.data.gates[gateId];
  },
  getNextRoomId(gateId, mobId) {
    var roomIds   = Indexer.data.gates[gateId].roomIds;
    var mobRoomId = Indexer.data.mobs[mobId].roomId;
    if (Indexer.isInList(gateId, Indexer.data.rooms[mobRoomId].gates)) {
      return roomIds[0]==mobRoomId ? roomIds[1] : roomIds[0];
    }
  },

  isInList(element, list) {
    return (list.indexOf(element) > -1);
  },
  addToList(element, list) {
    if (!Indexer.isInList(element, list)) {
      list.push(element);
    }
  },
  removeFromList(element, list) {
    if (Indexer.isInList(element, list)) {
      list.splice(list.indexOf(element), 1);
    }
  }
};

module.exports = Indexer;
