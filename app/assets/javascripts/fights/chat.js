$(function() {
  var dispatcher = new WebSocketRails('localhost:3000/websocket'); // pull host dynamically
  var connectionID = ''

  dispatcher.on_open = function(connID) {
    dispatcher.subscribe('lobby');
    connectionID = connID.connection_id;

    dispatcher.bind("chat.new_user", function(new_user){
      $('#users').append('<li class="challenge" value="' + new_user + '">' + new_user + '<li>')
    });
    console.log('Connection has been established: ', connID);

    dispatcher.trigger('chat.new_user', connectionID);
  };

  dispatcher.bind("chat.current_users", function(current_users){
  });

  dispatcher.bind("chat.message", function(message) {
    $("#chat").append('<li>' + message.connectionID + ' :    ' + message.message + '</li>');
  });

  $("#form").on("submit", function( evt ) {
    evt.preventDefault();
    var message = {
                    message: $("#message").val(),
                    connectionID: connectionID
                  };
    dispatcher.trigger("chat.message", message);
    this.reset();
  });
  // Bind challenge button to request challenge
  $( "#users" ).on( "click", ".challenge", function() {
    var challenge = {
                      current_user: connectionID,
                      challenger_id: $(this).attr('value')
                    };
    dispatcher.trigger("chat.challenge", challenge);
   console.log("Who would you like to challenge?");
  });

  // Bind dispatcher to listen for response from challenge method
  // sends invite to clicked user
  dispatcher.bind("chat.challenge", function( data ){
    if (connectionID == data.challenger_id){
      var x = confirm("would you like to challenge?");
      if (x === true) {
        dispatcher.trigger("chat.accept_challenge", data);
      }
    }
  });

  dispatcher.bind('game.new_game', function( gameID ) {
    var player = new Player( gameID );
  });
});
