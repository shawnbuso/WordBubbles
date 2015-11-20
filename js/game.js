var Cell = function(letter, row, col) {
  this.letter = letter.toUpperCase();
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

var Game = function(lengths) {
  this.board = [];
  this.wordLengths = lengths;
  for (length in this.wordLengths) {
     this.wordLengths[length] = parseInt(this.wordLengths[length]);
   }
}

Game.prototype.buildBoard = function(input) {
  var lines = input.split('\n');
  for (row in lines) {
    this.board.push([]);
    for (col in lines[row]) {
      this.board[row].push(new Cell(lines[row][col], row, col));
    }
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