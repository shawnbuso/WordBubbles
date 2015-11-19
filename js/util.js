var Util = function() {};

Util.delay = null;

Util.postMessage = function(message) {
  if (Util.delay) {
    Util.busyWait();
  }
  postMessage(JSON.stringify(message));
}

Util.busyWait = function() {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > Util.delay){
      break;
    }
  }
}