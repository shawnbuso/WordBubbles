class Node:
  def __init__(self, letter=None):
    self.children = []
    self.endWord = False
    self.letter = letter

  def __str__(self):
    return str(self.letter)

  def addChild(self, child):
    self.children.append(child)

  def getChildAt(self, index):
    return self.children[index]

  def getChildWithValue(self, letter):
    for child in self.children:
      if child.letter == letter:
        return child
    return None

  def hasChild(self, letter):
    for child in self.children:
      if child.letter == letter:
        return True
    return False