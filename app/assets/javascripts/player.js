function Player() {
  this.pokemon = new Pokemon( Pokemon.prototype.pokemonList[0] );
  this.initialize();
}

Player.prototype = {
  initialize: function() {
    var instance = this;

    // Set websocket client
    this.dispatcher = this.openSocket();

    // Set player ID
    this.dispatcher.on_open = function( data ) {
      instance.playerID = instance.getConnection( data );
    };

    // Subscribe to a private game channel
    this.game = this.subscribeRoom();

    // When game is ready to begin...
    this.game.bind( "ready", function( data ) {
      // Set opponent ID
      instance.opponentID = instance.getOpponent( data );

      // Ensure both players are at full health;
      instance.reset();
    });

    // Listen for attacks
    this.game.bind( "attack", function( data ) {
      if ( data.opponent === instance.playerID ) {
        instance.pokemon.receiveDamage( data.damage );

        // If Pokemon dies, end the game
        if ( instance.pokemon.health <= 0 ) {
          instance.game.trigger( "gameover", { winner: instance.opponentID });
        }
      }
    });

    // Listen for game over event
    this.game.bind( "gameover", function( data ){
      instance.dispatcher.unsubscribe( instance.game.name );

      if ( data.winner === instance.playerID ) {
        console.log( "You win!" );
      } else {
        console.log( "You lost!" );
      }
    });

    // Bind attack buttons to send attack messages
    $( "#attack" ).on( "click", function() {
      var damage = instance.pokemon.attack();
      instance.game.trigger( "attack", { opponent: instance.opponentID, damage: damage });
    });

    this.game.on_success = this.alertJoin;
  },
  openSocket: function() {
    // Open a websocket and return dispatcher object
    var host = location.host;
    return new WebSocketRails( host + "/websocket" );
  },
  subscribeRoom: function() {
    // Subscribe to a private room & return channel object
    var roomID = location.pathname.split( "/fights/" )[1];

    return this.dispatcher.subscribe_private( roomID );
  },
  getOpponent: function( data ) {
    // Return opponent ID
    var opponent = data[0] === this.playerID ? data[1] : data[0];
    console.log( "This is my opponent: " + opponent );
    console.log( "Both players are ready to play." );
    
    return opponent;
  },
  getConnection: function( data ) {
    // Return connection ID
    var playerID = data.connection_id;
    console.log( "Connection has been established: ", playerID );
    
    return playerID;
  },
  alertJoin: function() {
    console.log( "You have successfully joined the game.");
  },
  reset: function() {
    this.pokemon.health = this.pokemon.maxHealth;
  }
};