$(function() {
	var PIC_SIZE = 48;
	var PIC_DEFAULT = 'http://a0.twimg.com/sticky/default_profile_images/default_profile_0_bigger.png';
	
	if (!window.WebSocket){
    	$('body').empty();
		alert('This page requires Websocket support. Please use Chrome or Safari.');
	}

	window.console = console || {
	  log: function() { },
	  info: function() { },
	  debug: function() { }
	};

	var $window = $(window);
	var cols = Math.floor($window.height() / PIC_SIZE) + 1;
	var rows = Math.floor($window.width() / PIC_SIZE) + 1;
	var max = cols * rows;
	console.log('Grid: ' + cols +'x'+rows);
	
	var $wall = $('#wall');
	$wall.css('-webkit-column-count', cols + '');
	$wall.height((rows * PIC_SIZE) + 'px');
	$wall.width((cols * PIC_SIZE) + 'px');
	console.log('Wall size: ' + $wall.width() +'x'+$wall.height());

	ws_server_url = document.getElementById('ws-server-url').href;
	console.log("Connecting to WebSocket server: " + ws_server_url);
	ws = new WebSocket(ws_server_url);
	ws.onmessage = function(evt) {
		if (evt.data.indexOf('ping') == 0) {
			return false;
		}

		var data = JSON.parse(evt.data);
		var screen_name = data['user']['screen_name'];
		var profile_image_url = data['user']['profile_image_url'];
		var img = $('<img alt="@' + screen_name + '" title="@' + screen_name + '" src="' + profile_image_url + '" />').error(function() {
			$(this).unbind('error').attr('src', PIC_DEFAULT);
		})
		$wall.prepend(img);
		$wall.find('img:gt(' + (max - 1) + ')').remove();

		if (!data['primary'] && data['text'].indexOf('jquery') == -1) {// Conf over :(
			return false;
		}

		var $primary = $('#primary');
		$primary.stop().fadeOut();
		var tweet = '<img src="' + profile_image_url + '" /><p>' + data['text'] + '</p>';
		$primary.html(tweet);
		$primary.fadeIn();
	};
});