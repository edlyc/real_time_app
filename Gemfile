source "https://rubygems.org"
ruby "2.1.1"

gem "rails", "4.1.1"

group :development, :test do
  gem "spring", "1.1.3"
  gem "pry-rails", "0.3.2"            # debugger and Ruby console
  gem "awesome_print", "1.2.0"        # pretty print for pry gem
  gem "rspec-rails", "2.14.2"         # testing gem
  gem "guard-rspec", "4.2.9"          # automatically run tests when files are updated
  gem "spork-rails", "4.0.0"          # keeps the rails environment running for faster tests
  gem "guard-spork", "1.5.1"
  gem "childprocess", "0.5.3"
end

group :test do
  gem "nyan-cat-formatter", "0.5.2"   # make nyan cat rspecs
  gem "selenium-webdriver", "2.41.0"  # Capybara dependency
  gem "capybara", "2.2.1"             # BDD with English-like syntax
  gem "growl", "1.0.3"                # display test messages in conjunction with guard gem
  gem "shoulda-matchers", "2.6.1"     # matchers for model validations
  gem "factory_girl_rails", "4.4.1"   # generate user models with factories
  gem "database_cleaner", "1.2.0"     # clean database
end

gem "sass-rails", "4.0.3"
gem "uglifier", "2.5.0"
gem "coffee-rails", "4.0.1"
gem "jquery-rails", "3.1.0"
gem "turbolinks", "2.2.2"
gem "jbuilder", "2.0.7"
gem "bcrypt", "3.1.7"
gem "pg", "0.17.1"                    # for Heroku deployment
gem "password_strength", "0.4.1"      # adds password strength validation
gem "bootstrap-sass", "3.1.1.1"       # custom css with Bootstrap
gem "sprockets", "2.11.0"             # helps manage asset pipeline with Bootstrap
gem "websocket-rails"                 # real-time web experience with rails
gem 'redis' "3.1.0"                   # key-value persistent storage

group :doc do
  gem "sdoc", "0.4.0"
end

# setup app for deployment on Heroku
group :production do
  gem "rails_12factor", "0.0.2"       # serve static assets on Heroku
end
