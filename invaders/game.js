
;(function() {
	var Game = function(canvasId) {
		// properties
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height};
		var self = this;

		this.bodies = [new Player(this, gameSize)];

		// private or static function?
		var tick = function() {
			self.update();
			self.draw(screen, gameSize);
			requestAnimationFrame(tick);
		};

		tick();
	};

	Game.prototype = {
		// methods
		update: function() {

		},

		draw: function(screen, gameSize) {
			for (var i = 0; i < this.bodies.length; i++) {
				drawRect(screen, this.bodies[i]);
			}
		},
	};

	var Player = function(game, gameSize) {
		this.game = game;
		this.size = { x: 15, y: 15 };
		this.center = { x: gameSize.x / 2, y: gameSize.y - this.size.x };
	};

	// add methods here
	Player.prototype = {
		update: function() {},

	};

	var drawRect = function(screen, body) {
		screen.fillRect(body.center.x - body.size.x / 2,
			body.center.y - body.size.y / 2,
			body.size.x, body.size.y);
	}


	// main
	window.onload = function() {
		new Game("screen");
	};

})();