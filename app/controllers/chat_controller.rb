class ChatController < WebsocketRails::BaseController
  def initialize_session
    binding.pry
    # perform application setup here
    controller_store[:message_count] = 0
  end

  def message
    broadcast_message :message, data, :namespace => 'chat'
    # binding.pry
  end
end
