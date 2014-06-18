class ChatController < WebsocketRails::BaseController

  def initialize_session
  end

  def message
    broadcast_message :message, data, :namespace => 'chat'
  end

  def accept_challenge
    current_user = WebsocketRails['lobby'].subscribers.find do |conn|
      conn.id == data[:current_user]
    end

    rand_num = rand(1_000_000)
    game = WebsocketRails["#{rand_num}"]
    game.make_private


    current_user.send_message :new_game, game.name, :namespace => 'game'
    send_message :new_game, game.name, :namespace => 'game'
  end

  def challenge
    users = $redis.lrange("lobby_users", 0, -1)
    challenged_user = users.select do |user_id|
      user_id == data["challenger_id"]
    end
    broadcast_message :challenge, data, :namespace => 'chat'
  end

  def new_user
    broadcast_message :new_user, data, :namespace => 'chat'
    save_user(data)

    users = $redis.lrange("lobby_users", 0, -1)
    data = users.map do |user_id|
      username = $redis.hget("user:#{user_id}", "username")
      { id: user_id, username: username }
    end

    send_message :current_users, data, :namespace => 'chat'
  end

  def delete_user
    user_names = get_current_users
    connection_id = connection.id
    $redis.lrem('lobby_users', 0, connection_id)
    # reset current users based on actual lobby channel connections
    broadcast_message :remove_user, connection_id
  end

  private

  def save_user(conn_id)
    $redis.rpush("lobby_users", conn_id)
    rand_num = rand(99_999)
    $redis.hset("user:#{conn_id}", "username", "GuestUser#{rand_num}")
  end

  def get_current_users
    users = $redis.lrange("lobby_users", 0, -1)
    user_names = users.map do |user_id|
      $redis.hget("user:#{user_id}", "username")
    end
  end
end
