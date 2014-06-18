$(function() {
  var dispatcher = new WebSocketRails('localhost:3000/websocket'); // pull host dynamically
  var userName = '';
  var connID;

  dispatcher.on_open = function(connection) {
    dispatcher.subscribe('lobby');
    dispatcher.trigger('chat.update_users');

    connID = connection.connection_id;
    console.log('Connection has been established: ', connID);
  };

  dispatcher.bind("chat.update_users", function(current_users){
    var $users = $("#users");

    $users.html('');
    for ( var i = 0; i < current_users.length; i++ ) {
      var current_user = current_users[i];
      $users.append('<li data-user-id="' + current_user.id + '">' + current_user.username + '<li>');
    }
  });

  dispatcher.bind("chat.new_user", function(userInfo){
    $('#users').append('<li data-user-id="' + userInfo.id + '">' + userInfo.username + '<li>')
  });

  dispatcher.bind("chat.message", function(message) {
    $("#chat").append('<li>' + message.username + ':\t' + message.message + '</li>');
  });

   $("#user_name").on("submit", function( evt ) {
    evt.preventDefault();
    userName = $("#screen_name").val();
    while (userName === '') {
      window.alert('Please enter a valid screen name.');
      userName = $("#screen_name").val();
    }
    var userInfo = { id: connID, username: userName };
    dispatcher.trigger("chat.new_user", userInfo);

    $("#user_name").slideUp();
    $('#message_text').slideDown();
  });

   $("#message_text").on("submit", function( evt ) {
    evt.preventDefault();

    var message = { message: $("#message").val(), username: userName };

    dispatcher.trigger("chat.message", message);
    this.reset();
  });

  // Bind challenge button to request challenge
  $( "#users" ).on( "click", "[data-user-id]", function() {
    var challenge = {
                      current_user: connID,
                      challenger_id: $(this).data('user-id')
                    };
    dispatcher.trigger("chat.challenge", challenge);
  });

  // Bind dispatcher to listen for response from challenge method
  // sends invite to clicked user
  dispatcher.bind("chat.challenge", function( data ){
    if (connID == data.challenger_id){
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
