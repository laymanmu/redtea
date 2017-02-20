
var Mob       = require('./mob');
var Room      = require('./room');
var Gate      = require('./gate');
var Indexer   = require('./indexer');
var Messenger = require('./messenger');

var Game = {
  init(io) {
    Game.ticks    = 0;
    Game.tickTime = 3000;
    new Room("Cell", "A cell.");
    Messenger.init(io);
  },

  tick() {
    console.log(JSON.stringify(Indexer.data));
  },

  start() {
    Game.tick();
    Game.intervalId = setInterval(Game.tick, Game.tickTime);
  },
  stop() {
    clearInterval(Game.intervalId);
  }
}

Game.Mob       = Mob;
Game.Room      = Room;
Game.Gate      = Gate;
Game.Indexer   = Indexer;
Game.Messenger = Messenger;
module.exports = Game;
