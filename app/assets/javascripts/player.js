function Player() {
  this.initialize();
}

Player.prototype = {
  initialize: function() {
    var instance = this;

    // Set WebSocket (WS) client
    this.dispatcher = this.openSocket();

    // When the WS is successfully established...
    // Subscribe to the lobby channel
    this.dispatcher.on_open = function( data ) {
      instance.lobby = new Lobby( instance.dispatcher );

      // Listen for new game event and create a battle instance
      instance.dispatcher.bind( 'game.new_game', function( gameID ) {
        // Leave the lobby
        instance.lobby.destroy();

        // Start a new battle
        instance.battle = new Battle( instance.dispatcher, gameID );

        instance.battle.channel.bind( 'end_game', function() {
          instance.battle.destroy();
          instance.lobby.rejoin();
        });
      });
    };
  },

  // Open a WS connection and return dispatcher object
  openSocket: function() {
    var host = location.host;
    return new WebSocketRails( host + "/websocket" );
  }
};
