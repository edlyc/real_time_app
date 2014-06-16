$(function() {
  var dispatcher = new WebSocketRails('localhost:3000/websocket'); // pull host dynamically

  dispatcher.on_open = function(connID) {
    console.log('Connection has been established: ', connID);
  };

  dispatcher.bind("chat.message", function(message) {
    $("#chat").append('<li>' + message + '</li>');
  });

  $("#form").on("submit", function( evt ) {
    evt.preventDefault();

    var message = $("#message").val();
    dispatcher.trigger("chat.message", message);
    this.reset();
  });
});
