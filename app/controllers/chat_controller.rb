class ChatController < WebsocketRails::BaseController

  def initialize_session
  end

  def accept_challenge
    current_user = WebsocketRails["lobby"].subscribers.find do |conn|
      conn.id == data[:current_user]
    end

    rand_num = rand(1_000_000)
    game = WebsocketRails["#{rand_num}"]
    game.make_private


    current_user.send_message :new_game, game.name, :namespace => 'game'
    send_message :new_game, game.name, :namespace => 'game'
  end

  def new_user
    save_user data
    update_users
  end

  # Updates everybody's user list in the lobby
  def update_users
    lobby = WebsocketRails["lobby"]
    users = get_current_users
    lobby.trigger :update_users, users
  end

  # When a user accepts a challenge, both players are given a random room ID to join
  def accept_challenge
    current_user = find_lobby_user(data[:current_user])

    # Generate a random room from 0 - 999,999
    game_id = rand(1_000_000)

    # TODO: Check if game room is empty before sending to players

    current_user.send_message :new_game, game_id, :namespace => "game"
    send_message :new_game, game_id, :namespace => "game"
  end

  # Looks for recipient of challenge & issues challenge to them
  def challenge
    recipient = find_lobby_user(data[:recipient])
    recipient.send_message :challenge, :namespace => "chat"
  end

  def delete_user
    connection_id = connection.id
    $redis.lrem('lobby_users', 0, connection_id)
    user_names = get_current_users
    # reset current users based on actual lobby channel connections
    broadcast_message :update_users, user_names, :namespace => "chat"
  end

  private
  # Saves user to Redis, so we can pull a list of current users in the lobby
  def save_user( user )
    $redis.rpush("lobby_users", user[:id])
    $redis.hset("user:#{user[:id]}", "username", user[:username])
  end

  def get_current_users
    users = $redis.lrange("lobby_users", 0, -1)
    users.map do |user_id|
      username = $redis.hget("user:#{user_id}", "username")
      { id: user_id, username: username }
    end
  end

  # Finds the user connection based on ID
  def find_lobby_user(id)
    lobby_users = WebsocketRails["lobby"].subscribers
    lobby_users.find { |conn| conn.id == id }
  end
end
