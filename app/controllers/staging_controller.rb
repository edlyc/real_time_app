class StagingController < WebsocketRails::BaseController
  def initialize_session
    # perform application setup here
    controller_store[:message_count] = 0
  end

  def index
    send_message :message, "Hello"
  end
end