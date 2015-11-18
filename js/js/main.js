var consoleDiv = document.getElementById('console');
var colors = ["red", "yellow", "green", "blue"];
var colorIndex = 0;
var knownSolutions = [];

function getToIt() {
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
  var allTheWords = new Node();
  buildEnglishTrie(allTheWords), 50;
  setTimeout(function() {
    for (var i=0; i<game.getHeight(); i++) {
      for (var j=0; j<game.getWidth(); j++) {
        walkBoard(game, '', game.wordLengths, i, j, allTheWords, [], []);
      }
    }
  }, 50);
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
  game.drawBoard();
  word = word + game.board[row][col].letter;
  nodesInWord.push(game.board[row][col]);
  if (!trieHasWord(trie, word, false) ||
      word.length > Math.max.apply(null, wordLengths)) {
    game.board[row][col].setVisited(false);
    game.drawBoard();
    removeValueFromArray(game.board[row][col], nodesInWord);
    return;
  }
  if (trieHasWord(trie, word, true) &&
      wordLengths.indexOf(word.length) !== -1) {
    words.push(word);
    game.setInWords(nodesInWord, colors[colorIndex++]);
    removeValueFromArray(word.length, wordLengths);
    if (wordLengths.length == 0) {
      if (!knownSolutionExists(words.sort())) {
        game.printAnswer(words);
        var wordsCopy = JSON.parse(JSON.stringify(words)).sort();
        knownSolutions.push(wordsCopy);
      }
      game.clearInWords(nodesInWord);
      colorIndex--;
      game.board[row][col].setVisited(false);
      game.drawBoard();
      removeValueFromArray(game.board[row][col], nodesInWord);
      removeValueFromArray(word, words);
      if (words.length == 0) {
        colorIndex = 0;
      }
      wordLengths.push(word.length);
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
    colorIndex--;
    wordLengths.push(word.length);
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
  game.drawBoard();
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

function knownSolutionExists(words) {
  // Return words in knownSolutions
  var i, j;
  for (i in knownSolutions) {
    currentTest = knownSolutions[i];
    for (j in words) {
      if (currentTest[j] != words[j]) {
        console.log("These don't match:");
        console.log(currentTest);
        console.log(words);
        break;
      }
    }
    if (j == words.length-1) {
      console.log("These match:");
      console.log(currentTest);
      console.log(words);
      return true;
    }
  }
  return false;
}