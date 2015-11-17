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
  //alert(this);
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