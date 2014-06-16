class ChatController < WebsocketRails::BaseController
  def initialize_session
  end

  def message
    broadcast_message :message, data, :namespace => 'chat'
  end
end
