(function(window) {
mosquito_game_size = function() {
	this.initialize();
}
mosquito_game_size._SpriteSheet = new SpriteSheet({images: ["mosquito.png"], frames: [[0,0,215,215,0,107.3,121.9],[215,0,215,215,0,107.3,121.9],[430,0,215,215,0,107.3,121.9],[645,0,215,215,0,107.3,121.9],[0,215,215,215,0,107.3,121.9],[215,215,215,215,0,107.3,121.9],[430,215,215,215,0,107.3,121.9],[645,215,215,215,0,107.3,121.9],[0,430,215,215,0,107.3,121.9],[215,430,215,215,0,107.3,121.9],[430,430,215,215,0,107.3,121.9],[645,430,215,215,0,107.3,121.9],[0,645,215,215,0,107.3,121.9],[215,645,215,215,0,107.3,121.9]]});
var mosquito_game_size_p = mosquito_game_size.prototype = new BitmapAnimation();
mosquito_game_size_p.BitmapAnimation_initialize = mosquito_game_size_p.initialize;
mosquito_game_size_p.initialize = function() {
	this.BitmapAnimation_initialize(mosquito_game_size._SpriteSheet);
	this.paused = false;
}
window.mosquito_game_size = mosquito_game_size;
}(window));

