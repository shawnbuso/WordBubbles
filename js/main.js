var Application = function() {
  this.consoleDiv = document.getElementById('console');
  this.colors = ["red", "yellow", "green", "blue"];
  this.colorIndex = 0;
  this.knownSolutions = [];
  this.getToIt();
}

Application.prototype.getToIt = function() {
  var showPaths = document.getElementById('show-paths').checked;
  if (showPaths) {
    alert("You have opted to show paths in real time.\n" +
          "This can be super slow!\n"+
          "When the next alert box appears, click\n" +
          "\"Prevent this page from creating additional dialogs\"\n"+
          "(or similar)");
    alert("Click the checkbox below, then click \"OK\"");
  }
  this.game = new Game(showPaths);
  this.game.buildBoard(document.getElementById("grid").value);
  // allTheWords is set by trie.json
  this.allTheWords = allTheWords;
  this.setNodeProtos(this.allTheWords);
  var boardWalker = new BoardWalker(this);
  boardWalker.getToIt();
}

Application.prototype.setNodeProtos = function(node) {
  node.__proto__ = Node.prototype;
  for (child in node.children) {
    this.setNodeProtos(node.children[child]);
  }
}
