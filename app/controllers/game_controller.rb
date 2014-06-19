class GameController < WebsocketRails::BaseController
  def initialize_session
  end

  def attack
    game = WebsocketRails[data[:game]]         # Game instance
    players = game.subscribers                 # Players in game
    user_pokemon = connection_store[:pokemon]  # User's pokemon

    # Check if player is in an active game
    if game && players.include?(connection)
      # Get opponent
      opponent = players[0] == connection ? players[1] : players[0]

      # Only allow an attack every 2 seconds
      if !connection_store[:next_attack] || connection_store[:next_attack] < Time.now
        damage = user_pokemon.attack data[:attack_type]

        damage_info = {
          opponent: opponent.id,
          damage: damage,
          attack_type: data[:attack_type]
        }
        game.trigger :damage_dealt, damage_info
        connection_store[:next_attack] = 2.seconds.from_now
      end
    end
  end

  def join
    # Get the channel that the player is trying to join
    game = WebsocketRails[message[:channel]]
    # Only allow 2 players to join
    # When the 2nd person joins, start the game
    if game.subscribers.length < 2
      accept_channel
      game.trigger(:start_game) if game.subscribers.length == 2
    else
      deny_channel
    end
  end

  def receive_damage
    game = WebsocketRails[data[:game]]
    pokemon = connection_store[:pokemon]

    # Update pokemon's health
    health = pokemon.receive_damage(data[:damage])
    max_health = pokemon.max_health

    # End game if pokemon's health is below 0
    update_data = {
      player: connection.id,
      health: health,
      max_health: max_health,
      attack_type: data[:attack_type]
    }
    game.trigger(:update_game, update_data)
    
    # Send the loser's connection ID, when the game is over
    game.trigger(:end_game, connection.id) if health <= 0

  end

  def select_pokemon
    pokemon_list =  {
      bulbasaur: {
        name: "Bulbasaur",
        max_health: 70,
        attack_stat: 15
      },
      charmander: {
        name: "Charmander",
        max_health: 65,
        attack_stat: 20
      },
      pikachu: {
        name: "Pikachu",
        max_health: 40,
        attack_stat: 32
      },
      squirtle: {
        name: "Squirtle",
        max_health: 90,
        attack_stat: 10
      }
    }
    pokemon = Pokemon.new pokemon_list[data.to_sym]
    connection_store[:pokemon] = pokemon
  end
end
