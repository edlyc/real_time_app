# Use Redis Cloud add-on for Heroku on production, else connect to localhost on port 6379
settings = ENV["REDISCLOUD_URL"] ? { url: ENV["REDISCLOUD_URL"] } : { host: "localhost", port: 6379 }
$redis = Redis.new settings