var consoleDiv = document.getElementById('console');
var colors = ["red", "yellow", "green", "blue"];
var colorIndex = 0;

function getToIt() {
  var game = new Game();
  game.buildBoard(document.getElementById("grid").value);
  var allTheWords = new Node();
  buildEnglishTrie(allTheWords), 50;
  setTimeout(function() {
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        walkBoard(game, '', game.wordLengths, i, j, allTheWords, [], []);
      }
    }
  }, 50);
  console.log("Done");
}

function buildEnglishTrie(root) {
  for (i in Dictionary.WORDS) {
    addWordToTrie(Dictionary.WORDS[i], root);
  }
}

function addWordToTrie(word, node) {
  if (word.length == 0) {
    node.endWord = true;
    return;
  }
  var letterToAdd = word.charAt(0);
  if (node.hasChild(letterToAdd)) {
    addWordToTrie(word.substring(1), node.getChildWithValue(letterToAdd));
  } else {
    var newNode = new Node(letterToAdd)
    node.addChild(newNode);
    addWordToTrie(word.substring(1), newNode);
  }
}

function trieHasWord(node, word, isFullWord) {
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
    return trieHasWord(childWithLetter, word.substring(1), isFullWord);
  } else {
    return false;
  }
}

function walkBoard(game, word, wordLengths, row, col, trie, words, nodesInWord) {
  game.board[row][col].setVisited(true);
  word = word + game.board[row][col].letter;
  nodesInWord.push(game.board[row][col]);
  if (!trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    game.board[row][col].setVisited(false);
    removeValueFromArray(game.board[row][col], nodesInWord);
    return;
  }
  if (trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    game.setInWords(colors[colorIndex++]);
    removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      console.log(words);
      consoleDiv.innerHTML = consoleDiv.innerHTML + words.toString() + "<br/>";
      game.board[row][col].setVisited(false)
      removeValueFromArray(game.board[row][col], nodesInWord);
      removeValueFromArray(word, words);
      game.clearInWords(nodesInWord);
      nodesInWord.length = 0;
      wordLengths.push(word.length);
      colorIndex = 0;
      return;
    }
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        if (!(i == row && j == col) &&
            validCell(game, i, j) &&
            !game.board[i][j].visited) {
          setTimeout(walkBoard(game, "", wordLengths, i, j, trie, words, []), 50);
        }
      }
    }
    removeValueFromArray(word, words);
    game.clearInWords(nodesInWord);
    nodesInWord.length = 0;
    wordLengths.push(word.length);
    if (words.length == 0) {
      colorIndex = 0;
    }
  }
  for (var i=-1; i<2; i++) {
    for (var j=-1; j<2; j++) {
      var newRow = row + i;
      var newCol = col + j;
      if (!(newRow == row && newCol == col) &&
          validCell(game, newRow, newCol) &&
          !game.board[newRow][newCol].visited) {
        setTimeout(walkBoard(game, word, wordLengths, newRow, newCol, trie, words, nodesInWord), 50);
      }
    }
  }
  game.board[row][col].setVisited(false);
  removeValueFromArray(game.board[row][col], nodesInWord);
}

function validCell(game, row, col) {
  return (row >= 0 && row < game.getHeight() &&
          col >= 0 && col < game.getWidth());
}

function removeValueFromArray(value, array) {
  var i = array.indexOf(value);
  if (i !== -1) {
    array.splice(i, 1);
  }
}