WebsocketRails::EventMap.describe do
  namespace :lobby do
    subscribe :new_user, "lobby#new_user"
    subscribe :update_users, "lobby#update_users"
    subscribe :challenge, "lobby#challenge"
    subscribe :accept_challenge, "lobby#accept_challenge"
    subscribe :unsubscribe, "lobby#delete_user"
  end

  namespace :game do
    subscribe :attack, "game#attack"
    subscribe :receive_damage, "game#receive_damage"
  end

  namespace :websocket_rails do
    subscribe :subscribe_private, "game#join"
  end

  subscribe :client_disconnected, "lobby#delete_user"
end
