
var Commander = {
  cmdHistory: {cmds:[], pos:0, partial:""},

  addToHistory: function(cmdString) {
    Commander.cmdHistory.cmds.push(cmdString);
    Commander.cmdHistory.pos     = Commander.cmdHistory.cmds.length;
    Commander.cmdHistory.partial = "";
  },

  onPrevHistory: function() {
    // no commands in the history or already at the oldest command? - do nothing:
    if (Commander.cmdHistory.cmds.length==0 || Commander.cmdHistory.pos==0) return;
    // at the newest command? - grab the 'partial' stuff that the user may have typed:
    if (Commander.cmdHistory.pos == Commander.cmdHistory.cmds.length) {
      Commander.cmdHistory.partial = Client.ui.input.value;
    }
    // if there are more commands in the history, then move:
    if (Commander.cmdHistory.pos > 0) {
      Commander.cmdHistory.pos--;
      Client.ui.input.value = Commander.cmdHistory.cmds[Commander.cmdHistory.pos];
    }
  },

  onNextHistory: function() {
    // no history? - do nothing:
    if (Commander.cmdHistory.cmds.length==0) return;
    // if there are more then move:
    if (Commander.cmdHistory.pos < Commander.cmdHistory.cmds.length) {
      Commander.cmdHistory.pos++;
      if (Commander.cmdHistory.pos == Commander.cmdHistory.cmds.length) {
        Client.ui.input.value = Commander.cmdHistory.partial;
      } else {
        Client.ui.input.value = Commander.cmdHistory.cmds[Commander.cmdHistory.pos];
      }
    }
  },

  runCommand: function(cmdString) {
    if (!cmdString || cmdString.length==0) return;
    Commander.addToHistory(cmdString);
    var parms   = cmdString.match(/\w+|"(?:\\"|[^"])+"/g);
    var parms   = Commander.stripDoubleQuotesFromList(parms);
    var command = parms.shift();
    var found   = false;
    for (let cmdName in Commander.commands) {
      if (command == cmdName) {
        Commander.commands[cmdName](parms);
        found = true;
        break;
      }
    }
    if (!found) {
      Client.print(`couldn't find command \"${command}\" from: \"${cmdString}\"`);
    }
  },

  commands: {
    cd: function(parms) {
      var gateName  = parms[0];
      var foundGate = false;
      for (let gate of Client.room.gates) {
        if (gate.name == gateName) {
          Messenger.sendMsg('cd', {gateId:gate.id});
          foundGate = true;
          break;
        }
      }
      if (!foundGate) {
        var gatesString = JSON.stringify(Client.room.gates);
        Client.print(`cd: couldn't find gate:\"${gateName}\" in gates:${gatesString}`);
      }
    },

    mkroom: function(parms) {
      if (parms.length < 2) {
        Client.print(`mkroom: requires 2 parms (roomName, roomDesc). got: ${parms}`);
      } else {
        var roomName = parms.shift();
        var roomDesc = parms.join(" ");
        var msg      = {roomName:roomName, roomDesc:roomDesc};
        Messenger.sendMsg('mkroom', msg);
        Client.print(`sent mkroom msg: ${JSON.stringify(msg)}`);
      }
    }
  },

  stripDoubleQuotesFromstring: function(string) {
    return string.replace(/["]+/g, '');
  },

  stripDoubleQuotesFromList: function(list) {
    var stripped = [];
    for (let string of list) {
      stripped.push(Commander.stripDoubleQuotesFromstring(string));
    }
    return stripped;
  }

};
