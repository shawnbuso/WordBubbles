var Application = function() {
  this.consoleDiv = document.getElementById('console');
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.knownSolutions = [];
  this.getToIt();
}

Application.prototype.getToIt = function() {
  var showPaths = document.getElementById('show-paths').checked;
  if (showPaths) {
    alert("You have opted to show paths in real time.\n" +
          "This can be super slow!\n"+
          "When the next alert box appears, click\n" +
          "\"Prevent this page from creating additional dialogs\"\n"+
          "(or similar)");
    alert("Click the checkbox below, then click \"OK\"");
  }
  var game = new Game(showPaths);
  game.buildBoard(document.getElementById("grid").value);
  // allTheWords is set by trie.json
  this.allTheWords = allTheWords;
  this.setNodeProtos(this.allTheWords);
  for (var i=0; i<game.getHeight(); i++) {
    for (var j=0; j<game.getWidth(); j++) {
      this.walkBoard(game, '', game.wordLengths, i, j, this.allTheWords, [], []);
    }
  }
}

Application.prototype.setNodeProtos = function(node) {
  node.__proto__ = Node.prototype;
  for (child in node.children) {
    this.setNodeProtos(node.children[child]);
  }
}

Application.prototype.trieHasWord = function(node, word, isFullWord) {
  if (word.length == 0) {
    if (isFullWord) {
      if (node.endWord) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  var letterToFind = word.charAt(0);
  var childWithLetter = node.getChildWithValue(letterToFind);
  if (childWithLetter) {
    return this.trieHasWord(childWithLetter, word.substring(1), isFullWord);
  } else {
    return false;
  }
}

Application.prototype.walkBoard = function(game, word, wordLengths, row, col, trie, words, nodesInWord) {
  game.board[row][col].setVisited(true);
  game.drawBoard();
  word = word + game.board[row][col].letter;
  nodesInWord.push(game.board[row][col]);
  if (!this.trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    game.board[row][col].setVisited(false);
    game.drawBoard();
    this.removeValueFromArray(game.board[row][col], nodesInWord);
    return;
  }
  if (this.trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    game.setInWords(nodesInWord, this.colors[this.colorIndex++]);
    this.removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      if (!this.knownSolutionExists(words.sort())) {
        game.printAnswer(words);
        var wordsCopy = JSON.parse(JSON.stringify(words)).sort();
        this.knownSolutions.push(wordsCopy);
      }
      game.clearInWords(nodesInWord);
      this.colorIndex--;
      game.board[row][col].setVisited(false);
      game.drawBoard();
      this.removeValueFromArray(game.board[row][col], nodesInWord);
      this.removeValueFromArray(word, words);
      if (words.length == 0) {
        this.colorIndex = 0;
      }
      wordLengths.push(word.length);
      return;
    }
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        if (!(i == row && j == col) &&
            this.validCell(game, i, j) &&
            !game.board[i][j].visited) {
          this.walkBoard(game, "", wordLengths, i, j, trie, words, []);
        }
      }
    }
    this.removeValueFromArray(word, words);
    game.clearInWords(nodesInWord);
    this.colorIndex--;
    wordLengths.push(word.length);
  }
  for (var i=-1; i<2; i++) {
    for (var j=-1; j<2; j++) {
      var newRow = row + i;
      var newCol = col + j;
      if (!(newRow == row && newCol == col) &&
          this.validCell(game, newRow, newCol) &&
          !game.board[newRow][newCol].visited) {
        this.walkBoard(game, word, wordLengths, newRow, newCol, trie, words, nodesInWord);
      }
    }
  }
  game.board[row][col].setVisited(false);
  game.drawBoard();
  this.removeValueFromArray(game.board[row][col], nodesInWord);
}

Application.prototype.validCell = function(game, row, col) {
  return (row >= 0 && row < game.getHeight() &&
          col >= 0 && col < game.getWidth());
}

Application.prototype.removeValueFromArray = function(value, array) {
  var i = array.indexOf(value);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

Application.prototype.knownSolutionExists = function(words) {
  // Return words in knownSolutions
  var i, j, currentTest;
  for (i in this.knownSolutions) {
    currentTest = this.knownSolutions[i];
    for (j in words) {
      if (currentTest[j] != words[j]) {
        break;
      }
    }
    if (j == words.length-1) {
      return true;
    }
  }
  return false;
}
