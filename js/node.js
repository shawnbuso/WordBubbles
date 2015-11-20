var Node = function(letter) {
  this.children = [];
  this.endWord = false;
  this.letter = letter;
}

Node.prototype.addChild = function(child) {
  this.children.push(child);
}

Node.prototype.getChildWithValue = function(letter) {
  for (i in this.children) {
    if (this.children[i].letter == letter) {
      return this.children[i];
    }
  }
  return null;
}