from node import Node
from game import Game

WORDS_FILE = "/usr/share/dict/words"
DEBUG = False


def buildEnglishTrie(root):
  with open(WORDS_FILE) as f:
    for line in f:
      word = line.rstrip()
      addWordToTrie(word, root)

def addWordToTrie(word, node):
  if len(word) == 0:
    node.endWord = True
    return
  letterToAdd = word[0]
  if node.hasChild(letterToAdd):
    addWordToTrie(word[1:], node.getChildWithValue(letterToAdd))
  else:
    newNode = Node(letterToAdd)
    node.addChild(newNode)
    addWordToTrie(word[1:], newNode)

def trieHasWord(node, word, isFullWord=True):
  if len(word) == 0:
    if isFullWord:
      if node.endWord:
        return True
      else:
        return False
    else:
      return True
  letterToFind = word[0]
  childWithLetter = node.getChildWithValue(letterToFind)
  if childWithLetter:
    return trieHasWord(childWithLetter, word[1:], isFullWord)
  else:
    return False

def walkBoard(game, word, wordLengths, row, col, trie, words):
  game.board[row][col].visited = True
  word = word + game.board[row][col].letter
  if DEBUG:
    print "Called with the following:"
    print "\tword = " + word
    print "\twordLengths = " + str(wordLengths)
    print "\trow = " + str(row)
    print "\tcol = " + str(col)
    print "\twords = " + str(words)
  if (not trieHasWord(trie, word, False) or
      len(word) > max(wordLengths)):
    game.board[row][col].visited = False
    return
  if trieHasWord(trie, word) and len(word) in wordLengths:
    words.append(word)
    wordLengths.remove(len(word))
    if not wordLengths:
      print words
      game.board[row][col].visited = False
      words.remove(word)
      wordLengths.append(len(word))
      return
    for i in range(0, game.getHeight()):
      for j in range(0, game.getWidth()):
        if (not (i==row and j==col) and
            validCell(game, i, j) and
            not game.board[i][j].visited):
          walkBoard(game, "", wordLengths, i, j, trie, words)
    words.remove(word)
    wordLengths.append(len(word))
  for i in range(-1, 2):
    for j in range(-1, 2):
      newRow = row + i
      newCol = col + j
      if (not (newRow==row and newCol==col) and
          validCell(game, newRow, newCol) and
          not game.board[newRow][newCol].visited):
        walkBoard(game, word, wordLengths, newRow, newCol, trie, words)
  game.board[row][col].visited = False


def validCell(game, row, col):
  return (row >= 0 and row < game.getHeight() and
          col >= 0 and col < game.getWidth())

def main():
  allTheWords = Node()
  buildEnglishTrie(allTheWords)
  game = Game()
  game.buildBoardFromFile("input.txt")
  for i in range(0, game.getHeight()):
    for j in range(0, game.getWidth()):
      walkBoard(game, '', game.wordLengths, i, j, allTheWords, [])

if __name__ == "__main__":
  main()
