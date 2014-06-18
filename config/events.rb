WebsocketRails::EventMap.describe do
  namespace :chat do
    subscribe :new_user, "chat#new_user"
<<<<<<< HEAD
    subscribe :update_users, "chat#update_users"
=======
    subscribe :message, "chat#message"
    subscribe :update_users, "chat#get_users"
>>>>>>> working challenge capabilities
    subscribe :challenge, "chat#challenge"
    subscribe :accept_challenge, "chat#accept_challenge"
  end

  namespace :game do
    subscribe :attack, "game#attack"
    subscribe :receive_damage, "game#receive_damage"
  end

  namespace :websocket_rails do
    subscribe :subscribe_private, "game#join"
  end

  subscribe :client_disconnected, "chat#delete_user"
end
