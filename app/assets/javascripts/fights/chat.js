$(function() {
  var dispatcher = openSocket();
  var userName = '';           // User's screen name
  var connID;                  // WebSocket connection ID
  var lobby;                   // WebSocket channel 'lobby'
    
  var $users = $( '#users' );                 // List of users in the lobby
  var $chat_messages = $( '#chat' );          // Chat messages in the lobby
  var $user_name_form = $( '#user_name' );    // User name form
  var $user_name_field = $( '#screen_name' ); // User name field
  var $chat_form = $( '#message_text' );      // Chat form


  // Open websocket and return dispatcher object
  function openSocket() {
    return new WebSocketRails( location.host + '/websocket' );
  }

  // Go through the list of users and append each user name
  // Also, attaches the user id to the user-id data attribute
  function updateUsers( currentUsers ) {
    // Reset the list of users
    $users.html( '' );

    for ( var i = 0; i < currentUsers.length; i++ ) {
      var currentUser = currentUsers[i];
      $users.append( '<li data-user-id="' + currentUser.id + '">' + currentUser.username + '<li>' );
    }
  }

  // When the websocket connection is opened
  // Join the lobby channel and update current users
  dispatcher.on_open = function( connection ) {
    lobby = dispatcher.subscribe( 'lobby' );

    // Listen for the 'update_users' event
    // Update the view to see all the users
    lobby.bind( 'update_users', updateUsers );
    dispatcher.trigger( 'chat.update_users' );

    // Listen for chat.message event
    // Shows the chat message when someone sends a chat message to the lobby
    lobby.bind( 'message', function( message ) {
      $chat_messages.append( '<li>' + message.username + ':\t' + message.message + '</li>');
    });

    // Set the connection ID
    connID = connection.connection_id; 
  };

  // When a user submits a screen name
  $user_name_form.on( 'submit', function( evt ) {
    evt.preventDefault();

    // Setting the user's screen name
    userName = $user_name_field.val();

    // If the user name is empty, warn user and don't do anything
    // Otherwise, emit a new user event with the user's ID and username
    if ( userName === '' ) {
      window.alert( 'Please enter a valid screen name.' );
    } else {
      var userInfo = { id: connID, username: userName };
      dispatcher.trigger( 'chat.new_user', userInfo );
    }

    // Cool animation stuff
    $user_name_form.slideUp();
    $chat_form.slideDown();
  });

  // When you submit a chat message, it broadcasts the message to the lobby
  $chat_form.on( 'submit', function( evt ) {
    evt.preventDefault();

    messageContent = $( '#message' ).val();
    var message = { message: messageContent, username: userName };

    lobby.trigger( 'message', message );
    this.reset();
  });

  // Bind challenge button to request challenge
  // Send 'chat.challenge' event to server with both party's IDs (challenger & recipient)
  $users.on( 'click', 'li', function() {
    // Checks if recipient is not challenger
    var recipientID = $(this).data( 'user-id' );
    
    if ( typeof recipientID === "string" && recipientID !== connID ) {
      var challenge = { challenger: connID, recipient: recipientID };
      dispatcher.trigger( "chat.challenge", challenge );
    }

    // TODO: Popup a dialogue to let the user know they're waiting for a response
    // TODO: Timing out the challenge request
  });

  // Bind dispatcher to listen for response from challenge method
  // Opens a challenge dialogue when receiving this event
  dispatcher.bind( 'chat.challenge', function( data ){
    var acceptChallenge = confirm( 'Would you like to challenge?' );
    if ( acceptChallenge ) {
      dispatcher.trigger( 'chat.accept_challenge', data );
    }
  });

  // Redirect user to the fight room, when the challenger accepts
  dispatcher.bind( 'game.new_game', function( gameID ) {
    window.location = location.origin + '/fights/' + gameID;
  });
});
