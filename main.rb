#!/usr/bin/env ruby
require "rubygems"
require "bundler"
Bundler.setup(:default)

require "em-websocket"
require 'em-http-request'
require "sinatra/base"
require "thin"
require "rest-client"
require "haml"
require "active_record"
require "sqlite3"
require "json"

require './lib/utilities'
require './lib/twitterstream'

# require "ruby-debug"

##
# Define system variables
LOCAL_IP        = Utilities.local_ip    # IP Address of the server
FILE_IP         = File.exists?("./server.ip") ? File.open("./server.ip", "r").read.chomp : nil
SERVER_IP       = FILE_IP || LOCAL_IP   # IP Address of the server
USERID          = "userid1"             # Primary Twitter user id
USERID2         = "userid2"             # Seconday Twitter user id
PASSWORD        = "password1"           # Primary Twitter password
PASSWORD2       = "password2"           # Secondary Twitter password
PRIMARY_TERMS   = "cpl11,codepalousa"   # Search term(s) to track (comma seperated)
SECONDARY_TERMS = "jquery,ruby,rails,csharp,perl,sql,dotnet,webdev,javascript"
PUSH_TIMER      = 0.7                   # Number of seconds to wait before pushing data to the clients
CLEANUP_TIMER   = 10_800                # Number of seconds to wait before cleaning up DB data
PRESEED         = 200                   # Number of old records to send to each new client
 
##
# Set up the database
ActiveRecord::Base.establish_connection(
  :adapter  => "sqlite3",
  :database => "db/tweets.sqlite3"
)

ActiveRecord::Schema.define do
  create_table :tweets do |t|
    t.string    :text
    t.text      :data
    t.boolean   :processed, :default => false
    t.boolean   :primary,   :default => true
    t.string    :terms
    t.timestamps
  end
end rescue

class Tweet < ActiveRecord::Base  
  validates_uniqueness_of :data
  scope :processed,   where(:processed => true)
  scope :unprocessed, where(:processed => false)
  scope :main,        where(:primary => true)
  scope :background,  where(:primary => false)
end


EventMachine.run do
  class App < Sinatra::Base
    set :static, true
    set :public, "public"
    set :views,  "views"

    # Set the WebSocket server URL
    before do
      @ws_server_url = "ws://#{SERVER_IP}:8080"
    end    

    # main
    get "/" do
      haml :index
    end
  end

  # Open the feed to the Twitter stream(s)
  primary_stream    = TwitterStream.new(USERID, PASSWORD, PRIMARY_TERMS)
  secondary_stream  = TwitterStream.new(USERID2, PASSWORD2, SECONDARY_TERMS)

  # Process the primary tweets
  primary_stream.ontweet { |raw|
    begin
      tweet = JSON.parse(raw)['text']

      Tweet.create :text => tweet, :data => raw, :primary => true, :terms => PRIMARY_TERMS

      puts "New tweet: #{tweet}"
    rescue Exception => ex
      puts "[#{Time.now}] Something bad happened in the primary data loop : #{ex}"
    end
  }
  
  # Process the secondary tweets
  secondary_stream.ontweet { |raw|
    begin
      tweet = JSON.parse(raw)['text']

      Tweet.create :text => tweet, :data => raw, :primary => false, :terms => SECONDARY_TERMS

      puts "New secondary tweet: #{tweet}"
    rescue Exception => ex
      puts "[#{Time.now}] Something bad happened in the secondary data loop : #{ex}"
    end
  }


  @channel = EM::Channel.new

  # Push the data to any connected machines
  EventMachine::PeriodicTimer.new(PUSH_TIMER) do
    record = Tweet.unprocessed.first
    unless record.nil?
      res = JSON.parse(record.data)
      res[:primary] = record.primary?
      res[:terms] = record.terms

      @channel.push res.to_json
      record.processed = true
      record.save!
    end
  end
  
  # Open the WebSocket and start accepting connections
  EventMachine::WebSocket.start(:host => UDPSocket.open {|s| s.connect(LOCAL_IP, 1); s.addr.last }, :port => 8080, :debug => true) do |ws|
    sid = ""
    ws.onopen {
      sid = @channel.subscribe{ |msg| ws.send msg }

      # Push old data to the new client
      Tweet.processed.order("created_at DESC").limit(PRESEED).reverse.each do |record|
        res = JSON.parse(record.data)
        res[:primary] = record.primary?
        res[:terms] = record.terms
        ws.send res.to_json
      end
    }
    
    ws.onclose {
      @channel.unsubscribe(sid)
    }
  end

  # You could also use Rainbows! instead of Thin.
  # Any EM based Rack handler should do.
  App.run!({:port => 4000})
end
