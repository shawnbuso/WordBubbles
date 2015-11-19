var BoardWalker = function(lengths, gridString) {
  this.knownSolutions = [];
  // allTheWords set by loading trie.js
  this.fixNodeProtos(allTheWords);
  this.game = new Game(lengths);
  this.game.buildBoard(gridString);
}

BoardWalker.prototype.getToIt = function() {
  for (var i=0; i<this.game.getHeight(); i++) {
    for (var j=0; j<this.game.getWidth(); j++) {
      this.walkBoard(this.game, '', this.game.wordLengths, i, j, allTheWords, [], []);
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

BoardWalker.prototype.walkBoard = function(game, word, wordLengths, row, col, trie, words, nodesInWord) {
  game.board[row][col].setVisited(row, col, true);
  word = word + game.board[row][col].letter;
  nodesInWord.push(game.board[row][col]);
  if (!this.trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    game.board[row][col].setVisited(row, col, false);
    this.removeValueFromArray(game.board[row][col], nodesInWord);
    return;
  }
  if (this.trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    this.game.setInWords(nodesInWord);
    this.removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      if (!this.knownSolutionExists(words.sort())) {
        game.printAnswer(words);
        var wordsCopy = JSON.parse(JSON.stringify(words)).sort();
        this.knownSolutions.push(wordsCopy);
      }
      this.game.clearInWords(nodesInWord);
      game.board[row][col].setVisited(row, col, false);
      this.removeValueFromArray(game.board[row][col], nodesInWord);
      this.removeValueFromArray(word, words);
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
    this.game.clearInWords(nodesInWord);
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
  game.board[row][col].setVisited(row, col, false);
  this.removeValueFromArray(game.board[row][col], nodesInWord);
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

BoardWalker.prototype.knownSolutionExists = function(words) {
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