var Cell = function(letter, td) {
  this.letter = letter;
  this.visited = false;
  this.td = td;
}

Cell.prototype.setVisited = function(visited) {
  this.visited = visited;
  if (visited) {
    this.td.className = "visited";
  } else {
    this.td.className = "";
  }
  alert(this);
}

Cell.prototype.toString = function() {
  return this.letter;
}

var Game = function() {
  this.board = [];
  this.wordLengths = [];
}

Game.prototype.toString = function() {
  var ret = "";
  for (row in this.board) {
    for (cell in this.board[row]) {
      ret = ret + cell.toString() + " ";
    }
    ret = ret + "\n";
  }
  return ret;
}

Game.prototype.setInWords = function(color) {
  for (i in this.board) {
    for (j in this.board[i]) {
      if (this.board[i][j].td.className == "visited") {
        this.board[i][j].td.className = "";
        this.board[i][j].td.style.backgroundColor = color;
      }
    }
  }
}

Game.prototype.clearInWords = function(nodes) {
  for (i in nodes) {
    nodes[i].td.style.backgroundColor = '';
  }
}

Game.prototype.buildBoard = function(input) {
  var table = document.createElement('table');
  table.id = "table";
  var tbody = document.createElement('tbody');
  var lines = input.split('\n');
  var row = -1;
  for (line in lines) {
    if (row == -1) {
      this.wordLengths = lines[line].split(',');
      for (length in this.wordLengths) {
        this.wordLengths[length] = parseInt(this.wordLengths[length]);
      }
    } else {
      var tr = document.createElement('tr');
      this.board.push([]);
      var col = 0;
      for (cell in lines[line]) {
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(lines[line][cell]));
        tr.appendChild(td);
        this.board[row].push(new Cell(lines[line][cell], td));
        col++;
      }
      tbody.appendChild(tr);
    }
    row++;
  }
  table.appendChild(tbody);
  document.getElementById('table-container').appendChild(table);
}

Game.prototype.getHeight = function() {
  return this.board.length;
}

Game.prototype.getWidth = function() {
  return this.board[0].length;
}