
var Commander = {
  cmdHistory: {cmds:[], pos:0, partial:""},
  commands:   {},

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

    // update command history:
    Commander.cmdHistory.cmds.push(cmdString);
    Commander.cmdHistory.pos     = Commander.cmdHistory.cmds.length;
    Commander.cmdHistory.partial = "";

    // split the trimmed command string into a command & a parm:
    var trimmed  = cmdString.trim();
    var spacePos = trimmed.indexOf(' ');
    var command  = spacePos>0 ? trimmed.substr(0,spacePos) : trimmed;
    var parm     = spacePos>0 ? trimmed.substr(spacePos+1) : "";
    var cmdData  = {command:command, parm:parm};

    // for now just print the data:
    Client.print(JSON.stringify(cmdData));
  }
};
