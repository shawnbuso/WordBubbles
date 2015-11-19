var Application = function() {
  this.consoleDiv = document.getElementById('console');
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.knownSolutions = [];
  this.getToIt();
}

Application.prototype.getToIt = function() {
  this.gridString = document.getElementById('grid').value;
  this.lengths = document.getElementById('lengths').value.split(',');
  this.game = new GameUI(this.lengths);
  this.game.buildBoard(document.getElementById("grid").value);
  /*var boardWalker = new BoardWalker(this);
  boardWalker.getToIt();*/
  var boardWorker = new Worker('js/board-walker.js');
  boardWorker.onmessage = this.handleWorkerMessage.bind(this);
  boardWorker.postMessage(JSON.stringify(this));
}

Application.setNodeProtos = function(node) {
  node.__proto__ = Node.prototype;
  for (child in node.children) {
    Application.setNodeProtos(node.children[child]);
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
