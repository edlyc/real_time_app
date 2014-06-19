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
    };

  },

  // Open a WS connection and return dispatcher object
  openSocket: function() {
    var host = location.host;
    return new WebSocketRails( host + "/websocket" );
  }
};

// Subscribe to a private game channel
// this.game = this.subscribeRoom();

// subscribeRoom: function() {
//     var roomID = location.pathname.split( '/fights/' )[1];
//     return this.dispatcher.subscribe_private( roomID );
//   },
//   getOpponent: function( data ) {
//     // Return opponent ID
//     var opponent = data[0] === this.playerID ? data[1] : data[0];
//     return opponent;
//   }

// Old battle stuff
// When game is ready to begin...
  // this.game.bind( "start_game", function( data ) {
  //   console.log( "The game has begun." );
  // });

  // // Listen for damage_dealt event & send message to server to update pokemon's health
  // this.game.bind( "damage_dealt", function( data ) {
  //   if ( data.opponent === instance.playerID ) {
  //     var game_name = instance.game.name;
  //     instance.dispatcher.trigger( "game.receive_damage", { game: game_name, damage: data.damage, attack_type: data.attack_type });
  //   }
  // });

  // // Listen for update view event & update pokemon's health in view
  // this.game.bind( "update_game", function( data ) {
  //   // Hardcoded health bar -- should change when possible as now the player implementation is coupled to the view
  //   var targetIsSelf = data.player === instance.playerID;
    
  //   instance.view.updateView({
  //     targetIsSelf: targetIsSelf,
  //     health: data.health,
  //     maxHealth: data.max_health,
  //     attackType: data.attack_type
  //   });
  // });

  // // Listen for game over event
  // this.game.bind( "end_game", function( data ){
  //   instance.dispatcher.unsubscribe( instance.game.name );

  //   // var targetIsSelf = data.loser === instance.playerID;
  //   // instance.view.pokemonFaints( targetIsSelf );
  // });

  // // Bind attack buttons to send attack messages
  // $( ".attack" ).on( "click", function() {
  //   var gameName = instance.game.name;
  //   var attack_type = $(this).data( 'attack-type' );
  //   instance.dispatcher.trigger( "game.attack", {
  //     game: gameName,
  //     attack_type: attack_type
  //   });
  // });
