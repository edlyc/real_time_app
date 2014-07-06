# Use Redis Cloud add-on for Heroku on production, else connect to localhost on port 6379
settings = ENV["REDISTOGO_URL"] ? { url: ENV["REDISTOGO_URL"] } : { host: "localhost", port: 6379 }
$redis = Redis.new settings

# Ensure Redis is in a clean state
$redis.flushdb