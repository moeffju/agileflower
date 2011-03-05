# TwitCanvas

This is just a little program to build a display for the CodeapLOUsa conference to show incoming Twitter feeds on
a canvas.  Or something...

## Requirements

* Ruby 1.9.x
* Bundler is used to get all of the dependencies, so make sure you have it installed and you should be good to go.

## Installation

    $ gem install bundler  # Install bundler
    $ bundle install       # Install the rest of the necessary gems

## Usage

    $ ruby main.rb         # Start the server on port 4000

Now, just connect to http://localhost:4000 and it should start the whole thing off.  The index.html file gets downloaded
to your browser and it starts the connection to the WebSockets server.