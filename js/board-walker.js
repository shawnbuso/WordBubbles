var BoardWalker = function(lengths, gridString) {
  this.knownSolutions = [];
  this.currentWords = []
  // allTheWords set by loading trie.js
  this.fixNodeProtos(allTheWords);
  this.game = new Game(lengths);
  this.game.buildBoard(gridString);
}

BoardWalker.prototype.getToIt = function() {
  for (var i=0; i<this.game.getHeight(); i++) {
    for (var j=0; j<this.game.getWidth(); j++) {
      this.walkBoard([], this.game.wordLengths, i, j);
    }
  }
}

BoardWalker.prototype.trieHasWord = function(node, word, isFullWord) {
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

BoardWalker.prototype.walkBoard = function(nodesInWord, wordLengths, row, col) {
  this.game.board[row][col].setVisited(row, col, true);
  nodesInWord.push(this.game.board[row][col]);
  var word = ''
  for (node in nodesInWord) {
    word += nodesInWord[node].letter;
  }
  if (!this.trieHasWord(allTheWords, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    this.game.board[row][col].setVisited(row, col, false);
    this.removeValueFromArray(this.game.board[row][col], nodesInWord);
    return;
  }
  if (this.trieHasWord(allTheWords, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    this.currentWords.push(word);
    this.game.setInWords(nodesInWord);
    this.removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      if (!this.currentSolutionExists()) {
        this.game.printAnswer(this.currentWords);
        var currentWordsCopy = JSON.parse(JSON.stringify(this.currentWords));
        this.knownSolutions.push(currentWordsCopy.sort());
      }
      this.game.clearInWords(nodesInWord);
      this.game.board[row][col].setVisited(row, col, false);
      this.removeValueFromArray(this.game.board[row][col], nodesInWord);
      this.removeValueFromArray(word, this.currentWords);
      wordLengths.push(word.length);
      return;
    }
    for (var i=0; i<this.game.getHeight(); i++) {
      for (var j=0; j<this.game.getWidth(); j++) {
        if (!(i == row && j == col) &&
            this.validCell(this.game, i, j) &&
            !this.game.board[i][j].visited) {
          this.walkBoard([], wordLengths, i, j);
        }
      }
    }
    this.removeValueFromArray(word, this.currentWords);
    this.game.clearInWords(nodesInWord);
    wordLengths.push(word.length);
  }
  for (var i=-1; i<2; i++) {
    for (var j=-1; j<2; j++) {
      var newRow = row + i;
      var newCol = col + j;
      if (!(newRow == row && newCol == col) &&
          this.validCell(this.game, newRow, newCol) &&
          !this.game.board[newRow][newCol].visited) {
        this.walkBoard(nodesInWord, wordLengths, newRow, newCol);
      }
    }
  }
  this.game.board[row][col].setVisited(row, col, false);
  this.removeValueFromArray(this.game.board[row][col], nodesInWord);
}

BoardWalker.prototype.validCell = function(game, row, col) {
  return (row >= 0 && row < game.getHeight() &&
          col >= 0 && col < game.getWidth());
}

BoardWalker.prototype.removeValueFromArray = function(value, array) {
  var i = array.indexOf(value);
  if (i !== -1) {
    array.splice(i, 1);
  }
}

BoardWalker.prototype.currentSolutionExists = function() {
  // Return words in knownSolutions
  var i, j, currentTest;
  this.currentWords.sort();
  for (i in this.knownSolutions) {
    currentTest = this.knownSolutions[i];
    for (j in this.currentWords) {
      if (currentTest[j] != this.currentWords[j]) {
        break;
      }
    }
    if (j == this.currentWords.length-1) {
      return true;
    }
  }
  return false;
}

BoardWalker.prototype.fixNodeProtos = function(node) {
  node.__proto__ = Node.prototype;
  for (child in node.children) {
    this.fixNodeProtos(node.children[child]);
  }

}

onmessage = function(e) {
  // Load dependencies
  importScripts('../data/trie.js', 'game.js', 'node.js', 'main.js', 'util.js', 'worker-message.js');
  var data = JSON.parse(e.data);
  Util.delay = data.delay;
  var instance = new BoardWalker(data.lengths, data.gridString);
  instance.getToIt();
}