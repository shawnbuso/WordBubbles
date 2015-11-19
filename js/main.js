var Application = function() {
  this.consoleDiv = document.getElementById('console');
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.getToIt();
}

Application.prototype.getToIt = function() {
  var gridString = document.getElementById('grid').value;
  var lengths = document.getElementById('lengths').value.split(',');
  var delay = parseInt(document.getElementById('delay').value);
  this.game = new GameUI(this.lengths);
  this.game.buildBoard(document.getElementById("grid").value);
  var boardWorker = new Worker('js/board-walker.js');
  boardWorker.onmessage = this.handleWorkerMessage.bind(this);
  boardWorker.postMessage(JSON.stringify({'lengths': lengths, 'gridString': gridString, 'delay': delay}));
}

Application.prototype.handleWorkerMessage = function(xMessage) {
  var message = JSON.parse(xMessage.data);
  switch (message.code) {
    case WorkerMessage.Code.SET_VISITED:
      this.game.board[message.data.row][message.data.col].setVisited(message.data.visited);
      break;
    case WorkerMessage.Code.SET_IN_WORDS:
      var coords = message.data.coords;
      this.game.setInWords(coords, this.colors[this.colorIndex++]);
      break;
    case WorkerMessage.Code.CLEAR_IN_WORDS:
      var coords = message.data.coords;
      this.game.clearInWords(coords);
      this.colorIndex--;
      break;
    case WorkerMessage.Code.PRINT_ANSWER:
      var words = message.data.words;
      this.game.printAnswer(words);
      break;
  }
}
