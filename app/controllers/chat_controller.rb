class ChatController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
    controller_store[:message_count] = 0
  end

  def message
    broadcast_message :message, data, :namespace => 'chat'
  end
end