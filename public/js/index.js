$(function(){

	// get viewport size to lay out Raphael canvas,
	// - create canvas
	var win = $(window);
	
	win_height = win.height(),
	win_width = win.width(),
	win_padding = 20,
	canvas_width = (win_width - (win_padding * 2)),
	canvas_height = (win_height - (win_padding * 2)),
	canvas = Raphael([win_padding, win_padding, canvas_width, canvas_height, debug(),{}]);

	function debug(){
		console.log('debugging:');
		if(window.location.href.indexOf("debug") > 0){
			console.log('dimensions(winh/winw/canh/canw): ', win_height, win_width, canvas_height, canvas_width);
			return {type: 'rect', x: 0, y: 0, width: canvas_width, height: canvas_height, stroke: '#000'};
		} else {
			return {type: 'rect', x: 0, y: 0, width: canvas_width, height: canvas_height, stroke: '#fff'};
		}
	}
});