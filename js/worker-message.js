var WorkerMessage = function(code, data) {
  this.code = code;
  this.data = data;
}

WorkerMessage.Code = {};

WorkerMessage.Code.SET_VISITED = 0;

WorkerMessage.Code.SET_IN_WORDS = 1;

WorkerMessage.Code.CLEAR_IN_WORDS = 2;

WorkerMessage.Code.PRINT_ANSWER = 3;