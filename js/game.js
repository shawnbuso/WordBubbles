var Cell = function(letter, row, col) {
  this.letter = letter;
  this.visited = false;
  this.row = row;
  this.col = col;
}

Cell.prototype.setVisited = function(visited) {
  this.visited = visited;
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