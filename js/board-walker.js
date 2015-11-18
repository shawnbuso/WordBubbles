var BoardWalker = function(app) {
  this.app = app;
}

BoardWalker.prototype.getToIt = function() {
  for (var i=0; i<this.app.game.getHeight(); i++) {
    for (var j=0; j<this.app.game.getWidth(); j++) {
      this.walkBoard(this.app.game, '', this.app.game.wordLengths, i, j, this.app.allTheWords, [], []);
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

BoardWalker.prototype.markNodeVisited = function(game, row, col, visited) {
  game.board[row][col].setVisited(visited);
  var message = new WorkerMessage(
      WorkerMessage.Code.SET_VISITED,
      {"row": row, "col": col, "visited": visited});
  postMessage(JSON.stringify(message));
}

BoardWalker.prototype.setInWords = function(nodes, color) {
  var message = new WorkerMessage(
      WorkerMessage.Code.SET_IN_WORDS,
      {'nodes': JSON.stringify(nodes), 'color': color});
  postMessage(JSON.stringify(message));
}

BoardWalker.prototype.clearInWords = function(nodes) {
  var message = new WorkerMessage(
      WorkerMessage.Code.CLEAR_IN_WORDS,
      {'nodes': JSON.stringify(nodes)});
  postMessage(JSON.stringify(message));
}

BoardWalker.prototype.printAnswer = function(words) {
  var message = new WorkerMessage(
      WorkerMessage.Code.PRINT_ANSWER,
      {'words': words});
  postMessage(JSON.stringify(message));
}

BoardWalker.prototype.walkBoard = function(game, word, wordLengths, row, col, trie, words, nodesInWord) {
  this.markNodeVisited(game, row, col, true);
  game.drawBoard();
  word = word + game.board[row][col].letter;
  nodesInWord.push(game.board[row][col]);
  if (!this.trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    this.markNodeVisited(game, row, col, false);
    game.drawBoard();
    this.removeValueFromArray(game.board[row][col], nodesInWord);
    return;
  }
  if (this.trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    this.setInWords(nodesInWord, this.app.colors[this.app.colorIndex++]);
    this.removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      if (!this.knownSolutionExists(words.sort())) {
        this.printAnswer(words);
        var wordsCopy = JSON.parse(JSON.stringify(words)).sort();
        this.app.knownSolutions.push(wordsCopy);
      }
      this.clearInWords(nodesInWord);
      this.app.colorIndex--;
      this.markNodeVisited(game, row, col, false);
      game.drawBoard();
      this.removeValueFromArray(game.board[row][col], nodesInWord);
      this.removeValueFromArray(word, words);
      if (words.length == 0) {
        this.app.colorIndex = 0;
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
    this.clearInWords(nodesInWord);
    this.app.colorIndex--;
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
  this.markNodeVisited(game, row, col, false);
  game.drawBoard();
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
  for (i in this.app.knownSolutions) {
    currentTest = this.app.knownSolutions[i];
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

onmessage = function(e) {
  // Load dependencies
  importScripts('game.js', 'node.js', 'main.js', 'worker-message.js');
  var app = JSON.parse(e.data);
  Application.restoreProtos(app);
  var instance = new BoardWalker(app);
  instance.getToIt();
}