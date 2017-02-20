
var Entity  = require('./entity');
var Tracker = require('./entityTracker');
var Indexer = require('./indexer');
var rname   = require('node-random-name');

class Gate extends Entity {
  constructor(roomId1, roomId2) {
    super(Gate.Tracker.nextId(), rname({random:Math.random,last:true}));
    this.data.roomIds = [roomId1, roomId2];
    Gate.Tracker.add(this);
    Indexer.addGate(this.id, this.roomIds);
  }
  get roomIds() {
    return this.data.roomIds;
  }

  static get gates() {
    return Gate.Tracker.entities;
  }
  static get(id) {
    return Gate.Tracker.get(id);
  }
  static remove(id) {
    Gate.Tracker.remove(id);
    Indexer.removeGate(this);
  }
}

Gate.Tracker   = new Tracker();
module.exports = Gate;
