WebsocketRails::EventMap.describe do
  namespace :chat do
    subscribe :new_user, "chat#new_user"
    subscribe :message, "chat#message"
  end

  namespace :websocket_rails do
    subscribe :subscribe_private, "game#join"
  end
end
