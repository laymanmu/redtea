
var Game = {

  init() {
    Game.ticks    = 0;
    Game.tickTime = 3000;
    var cell = new Game.Room("Cell", "A cell.");
    var hall = new Game.Room("Hall", "A hall.");
    var gate = new Game.Gate(cell.id, hall.id);
  },

  tick() {
    Game.ticks++;
    console.log(JSON.stringify(Game.Indexer.data));
  },

  start() {
    Game.tick();
    Game.intervalId = setInterval(Game.tick, Game.tickTime);
  },

  stop() {
    clearInterval(Game.intervalId);
  }

}

Game.Mob       = require('./mob');
Game.Room      = require('./room');
Game.Gate      = require('./gate');
Game.Indexer   = require('./indexer');
Game.Messenger = require('./messenger');
module.exports = Game;
