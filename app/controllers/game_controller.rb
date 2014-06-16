class GameController < WebsocketRails::BaseController
  def initialize_session
  end

  def join
    # Get the channel that the player is trying to join
    game = WebsocketRails[message[:channel]]

    # Only allow 2 players to join
    # When the 2nd person joins, broadcast that the game is ready
    if game.subscribers.length < 2
      accept_channel
      subscribers = game.subscribers.map { |subscriber| subscriber.id }
      game.trigger(:ready, subscribers) if game.subscribers.length == 2
    else
      deny_channel
    end
  end
end