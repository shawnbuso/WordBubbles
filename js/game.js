var Cell = function(letter, td, row, col) {
  this.letter = letter;
  this.visited = false;
  this.td = td;
  this.row = row;
  this.col = col;
}

Cell.prototype.setVisited = function(visited) {
  this.visited = visited;
  if (visited) {
    this.td.className = "visited";
  } else {
    this.td.className = "";
  }
}

Cell.prototype.toString = function() {
  return this.letter;
}

var Game = function(showPaths) {
  //this.showPaths = showPaths;
  this.board = [];
  this.wordLengths = [];
  this.answersContainer = document.getElementById('answers-container');
  this.answersContainer.innerHTML = '';
  this.table = null;
}

Game.prototype.toString = function() {
  var ret = "";
  for (row in this.board) {
    for (cell in this.board[row]) {
      ret = ret + this.board[row][cell].toString() + " ";
    }
    ret = ret + "\n";
  }
  return ret;
}

Game.prototype.drawBoard = function() {
}

Game.prototype.setInWords = function(nodes, color) {
  for (i in nodes) {
    if (nodes[i].td.className == "visited") {
      nodes[i].td.style.backgroundColor = color;
    }
  }
  var x;
}

Game.prototype.clearInWords = function(nodes) {
  for (i in nodes) {
    nodes[i].wordsUsingMe--;
    nodes[i].td.style.backgroundColor = '';
  }
  var x;
}

Game.prototype.buildBoard = function(input) {
  var lengthsIn = document.getElementById('lengths').value;
  this.wordLengths = document.getElementById('lengths').value.split(',');
  for (length in this.wordLengths) {
     this.wordLengths[length] = parseInt(this.wordLengths[length]);
   }
  this.table = document.createElement('table');
  this.table.id = "table";
  //this.table.className = "board-state";
  var tbody = document.createElement('tbody');
  var lines = input.split('\n');
  var row = 0;
  for (line in lines) {
    var tr = document.createElement('tr');
    this.board.push([]);
    var col = 0;
    for (cell in lines[line]) {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(lines[line][cell]));
      tr.appendChild(td);
      this.board[row].push(new Cell(lines[line][cell], td, row, col));
      col++;
    }
    tbody.appendChild(tr);
    row++;
  }
  this.table.appendChild(tbody);
  var tableContainer = document.getElementById('table-container');
  tableContainer.innerHTML = '';
  tableContainer.appendChild(this.table);
}

Game.prototype.getHeight = function() {
  return this.board.length;
}

Game.prototype.getWidth = function() {
  return this.board[0].length;
}

Game.prototype.getTableCopy = function() {
  var newTable = document.createElement('table');
  newTable.innerHTML = this.table.innerHTML;
  return newTable;
}

Game.prototype.printAnswer = function(words) {
  var newTable = this.getTableCopy();
  this.answersContainer.appendChild(newTable);
  this.answersContainer.appendChild(document.createTextNode(words));
}

Game.prototype.setCellProtos = function(thisObj) {
  for (row in thisObj.board) {
    for (cell in thisObj.board[row]) {
      thisObj.board[row][cell].__proto__ = Cell.prototype;
    }
  }
}