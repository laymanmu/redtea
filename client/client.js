
var Client = {
  mouse: {clientX:0, clientY:0, pageX:0, pageY:0},
  room: {},
  user: {},

  init: function() {
		Client.initUI();
    Client.initEvents();
    Client.ui.input.focus();
    Messenger.init();
  },

  initUI: function() {
    Client.ui = {};
    Client.ui.roomName  = document.getElementById('roomName');
    Client.ui.roomDesc  = document.getElementById('roomDesc');
    Client.ui.roomGates = document.getElementById('roomGates');
    Client.ui.roomMobs  = document.getElementById('roomMobs');
    Client.ui.roomItems = document.getElementById('roomItems');
    Client.ui.output    = document.getElementById('output');
    Client.ui.input     = document.getElementById('input');
  },

  initEvents: function() {
    Client.ui.input.onkeydown = Client.onkeydown;
    document.onmousemove      = Client.onmousemove;
  },

  onmousemove: function(e) {
    Client.mouse.clientX = e.clientX;
    Client.mouse.clientY = e.clientY;
    Client.mouse.pageX   = e.pageX;
    Client.mouse.pageY   = e.pageY;
  },

  onkeydown: function(e) {
    e = e || window.event;
    var code = e.which==0 ? e.keyCode : e.which;
    Client.handleKeyCode(code);
  },

  print: function(msg) {
    Client.ui.output.innerHTML += msg + "<br>";
    Client.ui.output.scrollTop = Client.ui.output.scrollHeight;
  },

  handleKeyCode: function(code) {
    if (code == Keyboard.KEY_Enter) {
      var command = Client.ui.input.value;
      Client.ui.input.value = "";
      Commander.runCommand(command);
    } else if (code == Keyboard.KEY_UpArrow) {
      Commander.onPrevHistory();
    } else if (code == Keyboard.KEY_DownArrow) {
      Commander.onNextHistory();
    }
  }

};
