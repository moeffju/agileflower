$(function(){
	// Check for browser compatability
	if(!window.WebSocket){
    	$('body').empty();
		alert('This page requires Websocket support. Please use Chrome or Safari.');
	}

	// console.log safety
	if(!window.console){
		console = {
			log: function(x){ }
		};
	}

	function getRandColor(flag){
		if(flag){
			return '#58A618';
		} else {
			var colors = ['fff', 'e3e3e1', 'cbcbca', 'ccc', 'b1b1b1','9a9a99', '777', '838382','666666','484847','000'];
			return '#' + colors[Math.floor(Math.random() * 10)];
		}
	}
	
	function getRandFontSize(){
		var sizes = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
		return sizes[Math.floor(Math.random() * 10)] + 'px';
	}

	function getRandPosition(axis){
		var modifier = axis == 'x' ? 320 : 220,
			base = axis == 'x' ? $(window).width() : $(window).height(),
			rand = Math.floor(Math.random() * base);
			
		while(rand >= (base - modifier)){
			rand = getRandPosition(axis);
		}
		return rand > 0 ? rand : rand + (rand * 2);
	}

	// Connect to the web socket server
	ws_server_url = document.getElementById ('ws-server-url').href;
	console.log("Connecting to WebSocket server: " + ws_server_url);
	ws = new WebSocket(ws_server_url);
	
	// setup primary tweet counter
	primaryCtr = 0;

	// Process the WebSocket events as they come in
	ws.onmessage = function(evt){

		// Set up some variables
		var data  = JSON.parse(evt.data);

		// Add the new tweet to the list 
		$('#tweets').append('<div class="twittList"><img class="tweet fright"><p>' + data['text'] + '</p></div>');

		var wWidth = $(window).width(),
			wHeight = $(window).height(),
			horizontalPosition = getRandPosition('x'),
			verticalPosition = getRandPosition('y'),
			twitList = $('.twittList'),
			twitListFirst = twitList.filter(':first'),
			twitListLast = twitList.filter(':last'),
			tweetMax = 500;

		//Update the position this .twittList
		twitListLast.css({top: verticalPosition, left: horizontalPosition, display: 'block'});
		twitListLast.find('p, a').css({'color':getRandColor(data['primary']), 'font-size':getRandFontSize(data['primary']) });

		if(!data['primary']){
			twitListLast.fadeTo(2600, .15);
		} else {
			// give the latest primary tweet a special banner for readability
			$('#primary').html('<img src="' + data['user']['profile_image_url'] + '"/><p>' + data['text'] + '</p>');

			// refresh the primary terms banner on the bottom of the page
			$('#terms').html('<p>Using hashtags: <span>' + data['terms'] + '</span></p>');
			
			// identify primary tweets as primary in the dom
			twitListLast.addClass('primary');
			primaryCtr++;
		}

		// truncate tweet list when it reaches x
		if(twitList.length > tweetMax){
			if(twitListFirst.hasClass('primary')){
				if(primaryCtr > 10){
					twitListFirst.remove();
					primaryCtr--;
				}
			} else {
				twitListFirst.remove();
			}
		}

		// re-position logo and fleur imgs
		$('#fleur').css({'left':Math.floor((wWidth / 2) - (369 / 2)), 'top':Math.floor((wHeight / 2) - (388 / 2))});
	}

});