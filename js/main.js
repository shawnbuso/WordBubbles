var Application = function() {
  this.consoleDiv = document.getElementById('console');
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.knownSolutions = [];
  this.getToIt();
}

Application.prototype.getToIt = function() {
  /*var showPaths = document.getElementById('show-paths').checked;
  if (showPaths) {
    alert("You have opted to show paths in real time.\n" +
          "This can be super slow!\n"+
          "When the next alert box appears, click\n" +
          "\"Prevent this page from creating additional dialogs\"\n"+
          "(or similar)");
    alert("Click the checkbox below, then click \"OK\"");
  }*/
  this.game = new Game(/*showPaths*/);
  this.game.buildBoard(document.getElementById("grid").value);
  // allTheWords is set by trie.json
  this.allTheWords = allTheWords;
  //Application.setNodeProtos(this.allTheWords, this);
  /*var boardWalker = new BoardWalker(this);
  boardWalker.getToIt();*/
  var boardWorker = new Worker('js/board-walker.js');
  boardWorker.onmessage = this.handleWorkerMessage.bind(this);
  boardWorker.postMessage(JSON.stringify(this));
}

Application.restoreProtos = function(app) {
  //app.consoleDiv.__proto__ = Element.prototype;
  app.__proto__ = Application.prototype;
  app.game.__proto__ = Game.prototype;
  app.game.setCellProtos(app.game);
  Application.setNodeProtos(app.allTheWords, app);
}

Application.setNodeProtos = function(node, thisObj) {
  node.__proto__ = Node.prototype;
  for (child in node.children) {
    Application.setNodeProtos(node.children[child], thisObj);
  }
}

Application.prototype.handleWorkerMessage = function(xMessage) {
  var message = JSON.parse(xMessage.data);
  switch (message.code) {
    case WorkerMessage.Code.SET_VISITED:
      this.game.board[message.data.row][message.data.col].setVisited(message.data.visited);
      break;
    case WorkerMessage.Code.SET_IN_WORDS:
      var nodes = JSON.parse(message.data.nodes);
      var color = message.data.color;
      var myNodes = [];
      for (i in nodes) {
        myNodes.push(this.game.board[nodes[i].row][nodes[i].col]);
      }
      this.game.setInWords(myNodes, color);
      break;
    case WorkerMessage.Code.CLEAR_IN_WORDS:
      var nodes = JSON.parse(message.data.nodes);
      var myNodes = [];
      for (i in nodes) {
        myNodes.push(this.game.board[nodes[i].row][nodes[i].col]);
      }
      this.game.clearInWords(myNodes);
      break;
    case WorkerMessage.Code.PRINT_ANSWER:
      var words = message.data.words;
      this.game.printAnswer(words);
      break;
  }
}
