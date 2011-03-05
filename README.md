# TwitCanvas

This is just a little program to build a display for the CodeapLOUsa conference to show incoming Twitter feeds on
a canvas.  Hack on the code and there might be a prize for the best one.  :)

## Requirements

* Ruby 1.9.x
* Bundler is used to get all of the dependencies, so make sure you have it installed and you should be good to go.

## Installation

    $ gem install bundler  # Install bundler
    $ bundle install       # Install the rest of the necessary gems
    $ vi main.rv           # Add your Twitter account information to the
top of the file.

## Usage

The first time you start the server it creates the database and it will
probably throw an error.  Just run the command again and you should be
good to go.

    $ ruby main.rb         # Start the server on port 4000

Now, just connect to http://localhost:4000 and it should start the whole thing off.  The index.html file gets downloaded
to your browser and it starts the connection to the WebSockets server.


## Tips

### Easy Hack

The absolute easiest way to hack on this project is to edit the
tweet.css file in the public folder.  It's just plain CSS so you should
be able to make changes without worrying about breaking anything.  Just
edit the file and reload your page.  It's that simple.

### Medium Hack

The main "brains" of the page is located in the tweets.js file in the
public folder.  This has the potential to make more drastic changes but
you also run the risk of breaking something.  Make each tweet fly in
from above; play a "pop" sound when we get a new tweet; be creative!

### More Difficult Hack

The meat of the whole system is the main.rb file located in the root
directory.  Its not too complex just kinda persnickity.  Be carefull
with it and you should be OK.  Just remember to stop/restart the script
whenever you make changes to it.
