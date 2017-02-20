
var Mob     = require('./mob');
var Room    = require('./room');
var Gate    = require('./gate');
var Indexer = require('./indexer');

var Game = {
  init() {
    Game.ticks    = 0;
    Game.tickTime = 2000;
    Game.isInitialized = true;
  },

  tick() {
    Game.ticks++;
    console.log(`tick ${Game.ticks}`);
    console.log(Room.rooms);
    console.log(Gate.gates);
    console.log(Mob.mobs);
    console.log("Indexer.data:");
    console.log(JSON.stringify(Indexer.data, null, 2));
    console.log('');
  },
  start() {
    if (!Game.isInitialized) Game.init();
    Game.tick();
    Game.intervalId = setInterval(Game.tick, Game.tickTime);
  },
  stop() {
    clearInterval(Game.intervalId);
  }
}

Game.Mob     = Mob;
Game.Room    = Room;
Game.Gate    = Gate;
Game.Indexer = Indexer;
module.exports = Game;
