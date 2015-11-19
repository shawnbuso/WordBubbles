var Cell = function(letter, row, col) {
  this.letter = letter;
  this.visited = false;
  this.row = row;
  this.col = col;
}

Cell.prototype.setVisited = function(row, col, visited) {
  this.visited = visited;
  var message = new WorkerMessage(
      WorkerMessage.Code.SET_VISITED,
      {"row": row, "col": col, "visited": visited});
  Util.postMessage(message);
}

Cell.prototype.toString = function() {
  return this.letter;
}

var Game = function(lengths) {
  this.board = [];
  this.wordLengths = lengths;
  for (length in this.wordLengths) {
     this.wordLengths[length] = parseInt(this.wordLengths[length]);
   }
  this.table = null;
}

Game.prototype.buildBoard = function(input) {
  var lines = input.split('\n');
  var row = 0;
  for (line in lines) {
    this.board.push([]);
    var col = 0;
    for (cell in lines[line]) {
      this.board[row].push(new Cell(lines[line][cell], row, col));
      col++;
    }
    row++;
  }
}

Game.prototype.getHeight = function() {
  return this.board.length;
}

Game.prototype.getWidth = function() {
  return this.board[0].length;
}

Game.prototype.setInWords = function(nodes) {
  var coords = [];
  for (i in nodes) {
    coords.push([nodes[i].row, nodes[i].col]);
  }
  var message = new WorkerMessage(
      WorkerMessage.Code.SET_IN_WORDS,
      {'coords': coords});
  Util.postMessage(message);
}

Game.prototype.clearInWords = function(nodes) {
  var coords = [];
  for (i in nodes) {
    coords.push([nodes[i].row, nodes[i].col]);
  }
  var message = new WorkerMessage(
      WorkerMessage.Code.CLEAR_IN_WORDS,
      {'coords': coords});
  Util.postMessage(message);
}

Game.prototype.printAnswer = function(words) {
  var message = new WorkerMessage(
      WorkerMessage.Code.PRINT_ANSWER,
      {'words': words});
  Util.postMessage(message);
}