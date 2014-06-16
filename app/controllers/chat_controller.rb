class ChatController < WebsocketRails::BaseController
  def initialize_session
  end

  def message
    broadcast_message :message, data, :namespace => 'chat'
  end

  def new_user
    broadcast_message :new_user, data, :namespace => 'chat'
    controller_store[:users] = []
    controller_store[:users].push( data )
  end
end
