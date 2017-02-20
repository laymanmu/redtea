
var Entity  = require('./entity');
var Tracker = require('./entityTracker');
var Indexer = require('./indexer');
var rname   = require('node-random-name');

class Mob extends Entity {
  constructor(roomId) {
    super(Mob.Tracker.nextId(), rname({random:Math.random}));
    Mob.Tracker.add(this);
    Indexer.addMob(this.id, roomId);
  }
  enterGate(gateId) {
    var nextRoomId = Indexer.getNextRoomId(gateId, this.id);
    if (nextRoomId) {
      Indexer.moveMob(this.id, nextRoomId);
    }
  }
  
  static get mobs() {
    return Mob.Tracker.entities;
  }
  static remove(id) {
    Mob.Tracker.remove(id);
    Indexer.removeMob(id);
  }
  static get(id) {
    return Mob.Tracker.get(id);
  }
}

Mob.Tracker = new Tracker();
module.exports = Mob;
