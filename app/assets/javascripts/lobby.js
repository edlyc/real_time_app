function Lobby( dispatcher ) {
  this.dispatcher = dispatcher;
  this.initialize();
}

Lobby.prototype = {
  initialize: function() {
    var instance = this;

    // Grab all the important HTML elements in the lobby view
    this.elements = {
      lobby: $( '#lobby' ),              // Lobby container
      users: $( '#users' ),              // List of users in the lobby
      chatMessages: $( '#chat' ),        // Chat messages in the lobby
      chatForm: $( '#message_text' ),    // Chat form
      chatMessageField: $( '#message' ), // Chat message field
      usernameForm: $( '#user_name' ),   // User name form
      usernameField: $( '#screen_name' ) // User name field
    };

    // Subscribe to the lobby channel
    this.channel = this.dispatcher.subscribe( 'lobby' );

    // Listen for the 'update_users' event
    this.channel.bind( 'update_users', function( currentUsers ) {
      instance.updateUsers( currentUsers );
    });

    // Tell everyone in the lobby channel to update their view
    this.dispatcher.trigger( 'lobby.update_users' );

    // Listen for lobby.message event
    // Shows the chat message when someone sends a chat message to the lobby
    this.channel.bind( 'message', function( message ) {
      instance.updateMessages( message );
    });

    // Listen for challenge event
    // Opens a challenge dialogue when receiving this event
    this.dispatcher.bind( 'lobby.challenge', function( challenger ){
      instance.handleChallenge( challenger );
    });

    // Sets 'lobby.username' when user submits their username
    this.bindUsernameForm();

    // Updates everyone's chat messages on form submission
    this.bindChatForm();

    // Challenges a user if you click a username in the lobby's current user list
    this.bindUsernameClick();
  },

  // Updates everyone's chat messages on form submission
  bindChatForm: function() {
    var $chatForm = $( this.elements.chatForm );
    var $chatMessageField = $( this.elements.chatMessageField );
    var lobbyChannel = this.channel;
    var context = this;

    $chatForm.on( 'submit', function( evt ) {
      evt.preventDefault();

      // Get message time in HH:MM
      var date        = new Date( evt.timeStamp );
      var hours       = date.getHours();
      var minutes     = date.getMinutes();
      var messageTime = hours + ":" + minutes;

      // Get message text
      var messageText = $chatMessageField.val();

      var message = { timeStamp: messageTime, message: messageText, username: context.username };

      lobbyChannel.trigger( 'message', message );
      this.reset();
    });
  },

  // Challenges a user when a user clicks on a username in the current user list
  bindUsernameClick: function() {
    var $users = $( this.elements.users );
    var dispatcher = this.dispatcher;
    var connectionID = dispatcher._conn.connection_id;

    $users.on( 'click', 'li', function() {
      // Checks if recipient is not the same connection as the challenger
      var recipientID = $( this ).data( 'user-id' );
      if ( typeof recipientID === "string" && recipientID !== connectionID ) {
        dispatcher.trigger( "lobby.challenge", recipientID );
      }

      // TODO: Popup a dialogue to let the user know they're waiting for a response
      // TODO: Timing out the challenge request
    });
  },

  // Updates everyone's current user list on form submission
  bindUsernameForm: function() {
    var $usernameForm = $( this.elements.usernameForm );
    var $usernameField = $( this.elements.usernameField );
    var $chatForm = $( this.elements.chatForm );
    var dispatcher = this.dispatcher;
    var context = this;

    $usernameForm.on( 'submit', function( evt ) {
      evt.preventDefault();

      // Get the user's screen name
      var username = $usernameField.val();

      // If the user name is empty, warn user and don't do anything
      // Otherwise, emit a new user event with the user's ID and username
      if ( username === '' ) {
        window.alert( 'Please enter a valid screen name.' );
      } else {
        // Set username to object instance
        context.username = username;

        // Broadcast the new user to the lobby
        dispatcher.trigger( 'lobby.new_user', username );

        // Replace the user form with the chat form
        $usernameForm.hide();
        $chatForm.fadeIn();
        $( '#prompt' ).hide();
        $( '#logged_in' ).append( '<li>' + 'Logged in as: ' + username + '</li>' );
      }
    });
  },

  // Throw up a dialog if the user is challenged
  // If the user accepts dialog, send response to server with both player's connection IDs
  handleChallenge: function( challenger ) {
    var acceptChallenge = confirm( 'Would you like to challenge?' );
    var connectionID = this.dispatcher._conn.connection_id;

    // Send up both player IDs, if the challenge is accepted
    // Server will have this connection's ID
    if ( acceptChallenge ) {
      dispatcher.trigger( 'lobby.accept_challenge', challenger );
    } else {
      return false;
    }
  },

  // Hide the chat view
  hide: function() {
    $( this.elements.lobby ).hide();
  },

  // Show the chat view
  show: function() {
    $( this.elements.lobby ).show();
  },

  // Update the list of current users in the lobby
  updateUsers: function( currentUsers ) {
    // Reset the list of users
    var $users = $( this.elements.users );
    $users.html( '' );

    for ( var i = 0; i < currentUsers.length; i++ ) {
      var currentUser = currentUsers[i];

      // Create the user list element
      var userEl = $( '<li>' )
        .append( currentUser.username )
        .data( 'user-id', currentUser.id );

      $users.append( userEl );
    }
  },

  // Updates chat messages
  updateMessages: function( message ) {
    var messageHeader = [message.timeStamp, message.username].join(' | ');
    var messageContent = [messageHeader, message.message].join( ':\t' );

    var messageLine = $( '<li>' ).append( messageContent );
    $( this.elements.chatMessages ).append( messageLine );

    // Scrolls chat box to bottom of log on submit
    var objDiv = document.querySelector( ".lobby-messages" );
    objDiv.scrollTop = objDiv.scrollHeight;
  }
};
