var CellUI = function(letter, td, row, col) {
  this.letter = letter;
  this.td = td;
  this.row = row;
  this.col = col;
}

CellUI.prototype.setVisited = function(visited) {
  if (visited) {
    this.td.className = "visited";
  } else {
    this.td.className = "";
  }
}

CellUI.prototype.toString = function() {
  return this.letter;
}

var GameUI = function(lengths) {
  this.board = [];
  this.wordLengths = lengths;
  for (length in this.wordLengths) {
     this.wordLengths[length] = parseInt(this.wordLengths[length]);
   }
  if (typeof document !== 'undefined') {
    this.answersContainer = document.getElementById('answers-container');
    this.answersContainer.innerHTML = '';
  }
  this.table = null;
}

GameUI.prototype.setInWords = function(coords, color) {
  for (i in coords) {
    this.board[coords[i][0]][coords[i][1]].td.style.backgroundColor = color;
  }
}

GameUI.prototype.clearInWords = function(coords) {
  for (i in coords) {
    this.board[coords[i][0]][coords[i][1]].td.style.backgroundColor = '';
  }
}

GameUI.prototype.buildBoard = function(input) {
  this.table = document.createElement('table');
  this.table.id = "table";
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
      this.board[row].push(new CellUI(lines[line][cell], td, row, col));
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

GameUI.prototype.getTableCopy = function() {
  var newTable = document.createElement('table');
  newTable.innerHTML = this.table.innerHTML;
  return newTable;
}

GameUI.prototype.printAnswer = function(words) {
  var newTable = this.getTableCopy();
  this.answersContainer.appendChild(newTable);
  this.answersContainer.appendChild(document.createTextNode(words));
}