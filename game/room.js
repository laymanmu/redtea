
var Entity  = require('./entity');
var Tracker = require('./entityTracker');
var Indexer = require('./indexer');
var Mob     = require('./mob');
var Gate    = require('./gate');

class Room extends Entity {
  constructor(name, desc) {
    super(Room.Tracker.nextId(), name);
    this.data.desc = desc;
    Room.Tracker.add(this);
    Indexer.addRoom(this.id);
  }
  get desc() {
    return this.data.desc;
  }

  static getFullRoomMessage(roomId="1") {
    if (Room.cache[roomId]) {
      return Room.cache[roomId];
    }
    var room  = Room.get(roomId);
    var mobs  = [];
    var gates = [];
    var items = [];
    for (let mobId of Indexer.getMobIdsInRoom(roomId)) {
      var mob = Mob.get(mobId);
      var msg = {name:mob.name, id:mob.id};
      mobs.push(msg);
    }
    for (let gateId of Indexer.getGateIdsInRoom(roomId)) {
      var gate = Gate.get(gateId);
      var msg  = {name:gate.name, id:gate.id};
      gates.push(msg);
    }
    var msg = {
      name:   room.name,
      desc:   room.desc,
      mobs:   mobs,
      gates:  gates,
      items:  items
    };
    Room.cache.rooms[roomId] = msg;
    return msg;
  }

  static updateCache() {
    if (!Room.cache) Room.cache = {rooms:{}};
    Room.cache.rooms = {};
  }

  static get rooms() {
    return Room.Tracker.entities;
  }
  static get(id) {
    return Room.Tracker.get(id);
  }
  static remove(id) {
    Room.Tracker.remove(id);
    Indexer.removeRoom(id);
  }
}

Room.updateCache();
Room.Tracker   = new Tracker();
module.exports = Room;
