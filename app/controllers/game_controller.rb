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
        damage = user_pokemon.attack

        game.trigger(:damage_dealt, { opponent: opponent.id, damage: damage })
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
      set_pokemon
      game.trigger(:start_game) if game.subscribers.length == 2
    else
      deny_channel
    end

    def receive_damage
      game = WebsocketRails[data[:game]]
      pokemon = connection_store[:pokemon]

      # Update pokemon's health
      health = pokemon.receive_damage(data[:damage])
      max_health = pokemon.max_health

      # End game if pokemon's health is below 0
      game.trigger(:update_game, { player: connection.id, health: health, max_health: max_health })
      game.trigger(:end_game, { loser: connection.id }) if health <= 0
    end
  end

  private
  def set_pokemon
    bulbasaur = Pokemon.new({ name: "Bulbasaur", max_health: 40, attack_stat: 15 })
    connection_store[:pokemon] = bulbasaur
  end
end