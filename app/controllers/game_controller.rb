class GameController < WebsocketRails::BaseController
  def initialize_session
  end

  def join
    # Get the channel that the player is trying to join
    game = WebsocketRails[message[:channel]]
    num_players = game.subscribers.length

    # Only allow 2 players to join
    # When the 2nd person joins, broadcast that the game is ready
    if num_players < 2
      accept_channel
      game.trigger :ready if num_players == 2
    else
      deny_channel
    end
  end
end