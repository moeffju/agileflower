$(function() {
  var PIC_SIZE = 48;
  var PIC_DEFAULT = 'http://a0.twimg.com/sticky/default_profile_images/default_profile_0_bigger.png';
  
  /*
  if (!window.WebSocket){
      $('body').empty();
    alert('This page requires Websocket support. Please use Chrome or Safari.');
  }
  */

  window.console = console || {
    log: function() { },
    info: function() { },
    debug: function() { }
  };
  
  var pad = function(x, n) {
    x = x.toString();
    while (x.length < n) x = '0' + x;
    return x;
  }

  var $window = $(window);
  var $wall = $('#wall');

  ws_server_url = document.getElementById('ws-server-url').href;
  console.log("Connecting to WebSocket server: " + ws_server_url);
  ws = new WebSocket(ws_server_url);
  ws.onmessage = function(evt) {
    if (evt.data.indexOf('ping') == 0) {
      return false;
    }

    var data = JSON.parse(evt.data);
    console.log(data);
    var screen_name = data['user']['screen_name'];
    var profile_image_url = data['user']['profile_image_url'];
    
    var tweeth = $('<div class="tweet-holder"></div>');
    var tweet = $('<div class="tweet"></div>');
    var img = $('<img alt="@' + screen_name + '" title="@' + screen_name + '" src="' + profile_image_url + '" />').error(function() {
      $(this).unbind('error').attr('src', PIC_DEFAULT);
    })
    var text = $('<p>' + data['parsed_text'] + '</p>');
    var date = new Date(data['created_at']);
    var meta = $('<div class="meta"><a href="https://twitter.com/'+data['user']['screen_name']+'" class="username">'+data['user']['name']+'</a> um <a href="http://twitter.com/'+data['user']['screen_name']+'/status/'+data['id_str']+'" class="permalink">'+[1900+date.getYear(),'-',pad(date.getMonth()+1, 2),'-',pad(date.getDate(),2),' ',date.getHours(),':',pad(date.getMinutes(),2),':',pad(date.getSeconds(), 2)].join('')+'</a></div>');
    
    tweet.append(text);
    tweet.append(meta);
    
    tweeth.append(img);
    tweeth.append(tweet);
    
    $wall.prepend(tweeth);
  };
});