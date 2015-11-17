class Cell:
  def __init__(self, letter):
    self.letter = letter
    self.visited = False

  def __str__(self):
    return self.letter

class Game:
  def __init__(self):
    self.board = []
    self.wordLengths = []

  def __str__(self):
    ret = ""
    for row in self.board:
      for cell in row:
        ret = ret + str(cell) + " "
      ret = ret + "\n"
    return ret

  def buildBoardFromFile(self, filename):
    with open(filename) as f:
      row = -1
      for line in f:
        line = line.rstrip()
        if row == -1:
          self.wordLengths = sorted(line.split(","), reverse=True)
          self.wordLengths = [int(x) for x in self.wordLengths]
        else:
          self.board.append([])
          column = 0
          for item in line:
            self.board[row].append(Cell(item))
            column = column + 1
        row = row + 1

  def getHeight(self):
    return len(self.board)

  def getWidth(self):
    return len(self.board[0])