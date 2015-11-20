var CellUI = function(letter, td) {
  this.letter = letter;
  this.td = td;
}

CellUI.prototype.setVisited = function(visited) {
  if (visited) {
    this.td.className = "visited";
  } else {
    this.td.className = "";
  }
}

var GameUI = function() {
  this.board = [];
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.answersContainer = document.getElementById('answers-container');
  this.answersContainer.innerHTML = '';
  this.table = null;
}

GameUI.prototype.setInWords = function(coords) {
  for (i in coords) {
    this.board[coords[i][0]][coords[i][1]].td.style.backgroundColor = this.colors[this.colorIndex];
  }
  this.colorIndex++;
}

GameUI.prototype.clearInWords = function(coords) {
  for (i in coords) {
    this.board[coords[i][0]][coords[i][1]].td.style.backgroundColor = '';
  }
  this.colorIndex--;
}

GameUI.prototype.buildBoard = function(input) {
  this.table = document.createElement('table');
  this.table.id = "table";
  var tbody = document.createElement('tbody');
  var lines = input.split('\n');
  for (row in lines) {
    var tr = document.createElement('tr');
    this.board.push([]);
    for (col in lines[row]) {
      var letter = lines[row][col].toUpperCase();
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(letter));
      tr.appendChild(td);
      this.board[row].push(new CellUI(letter, td));
    }
    tbody.appendChild(tr);
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