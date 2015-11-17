var Application = function() {
  var game = new Game();
  game.buildBoard(document.getElementById("grid").value);
  setTimeout((function() {
    var allTheWords = new Node();
    this.buildEnglishTrie(allTheWords), 50;
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        this.walkBoard(game, '', game.wordLengths, i, j, allTheWords, []);
      }
    }
  }).bind(this), 50);
  console.log("Done");
}

Application.prototype.buildEnglishTrie = function(root) {
  for (i in Dictionary.WORDS) {
    this.addWordToTrie(Dictionary.WORDS[i], root);
  }
}

Application.prototype.addWordToTrie = function(word, node) {
  if (word.length == 0) {
    node.endWord = true;
    return;
  }
  var letterToAdd = word.charAt(0);
  if (node.hasChild(letterToAdd)) {
    this.addWordToTrie(word.substring(1), node.getChildWithValue(letterToAdd));
  } else {
    var newNode = new Node(letterToAdd)
    node.addChild(newNode);
    this.addWordToTrie(word.substring(1), newNode);
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

Application.prototype.walkBoard =
    function(game, word, wordLengths, row, col, trie, words) {
  game.board[row][col].setVisited(true);
  word = word + game.board[row][col].letter;
  /*console.log("Called with the following:");
  console.log("\tword = " + word);
  console.log("\twordLengths = " + wordLengths);
  console.log("\trow = " + row);
  console.log("\tcol = " + col);
  console.log("\twords = " + words);*/
  if (!this.trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    game.board[row][col].setVisited(false);
    return;
  }
  if (this.trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    this.removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      console.log(words);
      game.board[row][col].setVisited(false)
      this.removeValueFromArray(word, words);
      wordLengths.push(word.length);
      return;
    }
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        if (!(i == row && j == col) &&
            this.validCell(game, i, j) &&
            !game.board[i][j].visited) {
          this.walkBoard(game, "", wordLengths, i, j, trie, words);
        }
      }
    }
    this.removeValueFromArray(word, words);
    wordLengths.push(word.length);
  }
  for (var i=-1; i<2; i++) {
    for (var j=-1; j<2; j++) {
      var newRow = row + i;
      var newCol = col + j;
      if (!(newRow == row && newCol == col) &&
          this.validCell(game, newRow, newCol) &&
          !game.board[newRow][newCol].visited) {
        this.walkBoard(game, word, wordLengths, newRow, newCol, trie, words);
      }
    }
  }
  game.board[row][col].setVisited(false);
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
  /*if (array.length == 1 && array[0] == value) {
    return [];
  }
  var what, ax;
  var length = array.length;
  while (length > 1 && array.length) {
    what = array[--length];
    while ((ax = array.indexOf(what)) !== -1) {
      array.splice(ax, 1);
    }
  }
  return array;*/
}