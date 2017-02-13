
var rname = require('node-random-name');

var MobController = {
  mobs: {},

  createMob: function(socket) {
    var mob = {name:rname(), socket:socket};
    MobController.mobs[mob.name] = mob;
    return mob;
  },

  deleteMob: function(mob) {
    delete MobController.mobs[mob.name];
  }

};

module.exports = MobController;
