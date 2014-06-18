require File.expand_path('../boot', __FILE__)

# Pick the frameworks you want:
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module RealTimeApp
  class Application < Rails::Application
    config.assets.precompile += %w( fights/chat.js fights/battle_view.js player.js )
    config.autoload_paths += %W(#{config.root}/lib)
    config.cache_store = :redis_store, 'redis://localhost:6379/0/cache', { expires_in: 90.minutes }
    config.assets.enabled = true
    config.assets.paths << "#{Rails.root}/app/assets/fonts"
  end
end

