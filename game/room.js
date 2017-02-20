
var Entity  = require('./entity');
var Tracker = require('./entityTracker');
var Indexer = require('./indexer');

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

  static getFullRoom(roomId="1") {
    if (Room.cache[roomId]) {
      return Room.cache[roomId];
    }
    var room = Room.get(roomId);
    var msg  = {
      name:   room.name,
      desc:   room.desc,
      mobs:   [],
      items: [],
      gates:  []
    }
    Room.cache.rooms[roomId] = msg;
    return msg;
  }
  static rebuildCache() {
    Room.cache = {rooms:[]};
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

Room.rebuildCache();
Room.Tracker   = new Tracker();
module.exports = Room;
