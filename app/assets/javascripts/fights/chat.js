$(function() {
  var dispatcher = new WebSocketRails('localhost:3000/websocket'); // pull host dynamically
  var userName = ''

  dispatcher.on_open = function(connID) {
    userName = connID.connection_id;
  var userName = '';

  dispatcher.on_open = function(connID) {
    userName = connID.connection_id;

    dispatcher.bind("chat.new_user", function(new_user){
      $('#users').append('<li>' + new_user + '<li>');
    });
    console.log('Connection has been established: ', connID);

    dispatcher.trigger('chat.new_user', userName);
  };

  dispatcher.bind("chat.message", function(message) {
    $("#chat").append('<li>' + message.userName + ' :    ' + message.message + '</li>');
  });

  $("#form").on("submit", function( evt ) {
    evt.preventDefault();
    var message = {
                    message: $("#message").val(),
                    userName: userName
                  };
    dispatcher.trigger("chat.message", message);
    this.reset();
  });
});
