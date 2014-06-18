class ChatController < WebsocketRails::BaseController
  @@lobby_room = "lobby"            # Websocket channel name for the lobby
  @@lobby_users = "lobby_users"     # Redis field for lobby users

  def initialize_session
  end

  # Saves user to the database and updates user views for everyone in the lobby
  def new_user
    save_user(data)
    update_users
  end

  # Updates everybody's user list in the lobby
  def update_users
    lobby = WebsocketRails[@@lobby_room]
    users = get_current_users
    lobby.trigger :update_users, users
  end

  # When a user accepts a challenge, both players are given a random room ID to join
  def accept_challenge
    challenger = find_lobby_user(data[:challenger])

    # Generate a random room from 0 - 999,999
    game_id = rand(1_000_000)

    # TODO: Check if game room is empty before sending to players

    challenger.send_message :new_game, game_id, :namespace => "game"
    send_message :new_game, game_id, :namespace => "game"
  end

  # Looks for recipient of challenge & issues challenge to them
  def challenge
    recipient = find_lobby_user(data[:recipient])
    recipient.send_message :challenge, data, :namespace => "chat"
  end

  def delete_user
    connection_id = connection.id
    $redis.lrem(@@lobby_users, 0, connection_id)
    update_users
  end

  private
  # Saves user to Redis, so we can pull a list of current users in the lobby
  def save_user(data)
    $redis.rpush(@@lobby_users, data[:id])
    $redis.hset("user:#{data[:id]}", "username", data[:username])
  end

  # Gets current lobby users (id and username) from Redis
  def get_current_users
    users = $redis.lrange(@@lobby_users, 0, -1)
    users.map do |user_id|
      username = $redis.hget("user:#{user_id}", "username")
      { id: user_id, username: username }
    end
  end

  # Finds the user connection based on ID
  def find_lobby_user(id)
    lobby_users = WebsocketRails[@@lobby_room].subscribers
    lobby_users.find { |conn| conn.id == id }
  end
end
