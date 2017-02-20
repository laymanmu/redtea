
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

Room.Tracker   = new Tracker();
module.exports = Room;
