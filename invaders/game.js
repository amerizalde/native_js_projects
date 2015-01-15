(function () {

    var drawRect = function (screen, body) {
        screen.fillRect(body.center.x - body.size.x / 2,
            body.center.y - body.size.y / 2,
            body.size.x, body.size.y);
    },

        KeyBoarder = function () {
            var keyState = {};

            window.onkeydown = function (e) {
                keyState[e.keyCode] = true;
            };

            window.onkeyup = function (e) {
                keyState[e.keyCode] = false;
            };

            this.isDown = function (keyCode) {
                return keyState[keyCode] === true;
            }

            this.KEYS = {
                LEFT: 37,
                RIGHT: 39,
                SPACE: 32,
                ESCAPE: 27
            };
    },

        create_invaders = function (game) {
            var invaders = [];
            for (var i = 0; i < 24; i++) {
                var x = 30 + (i % 8) * 30;  // 8 COLUMNS
                var y = 30 + (i % 3) * 30;  // 3 ROWS
                invaders.push(new Invader(game, {
                    x: x,
                    y: y
                }));
            }
            return invaders;
    },

        colliding = function (b1, b2) {
            // returns the whether they are colliding by ruling out the conditions
            // where they definitely would NOT be colliding
            return !((b1 === b2) ||
                (b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2) ||
                (b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2) ||
                (b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2) ||
                (b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2)
            );
    },

        // GAME CONSTRUCTOR
        Game = function (canvasId) {
            // properties
            var canvas = document.getElementById(canvasId);
            var screen = canvas.getContext('2d');
            var gameSize = {
                x: canvas.width,
                y: canvas.height
            };
            var self = this;

            this.bodies = create_invaders(this).concat(new Player(this, gameSize));

            // private or static function?
            var tick = function () {
                self.update();
                self.draw(screen, gameSize);
                requestAnimationFrame(tick);
            };

            tick();
    };

    // ADD METHODS HERE
    Game.prototype = {
        update: function () {
            var bodies = this.bodies;
            // keep only the bodies that are colliding.
            // if this === 0 then nothing is colliding.
            var collision_check = function (b1) {
                return bodies.filter(function (b2) {
                    return colliding(b1, b2);
                }).length === 0;
            }

            this.bodies = this.bodies.filter(collision_check);

            for (var i = 0; i < this.bodies.length; i++) {
                this.bodies[i].update();
            }
        },

        draw: function (screen, gameSize) {
            screen.clearRect(0, 0, gameSize.x, gameSize.y);
            for (var i = 0; i < this.bodies.length; i++) {
                drawRect(screen, this.bodies[i]);
            }
        },

        addBody: function (body) {
            this.bodies.push(body);
        },
    };

    // PLAYER CONSTRUCTOR
    var Player = function (game, gameSize) {
        this.game = game;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = {
            x: gameSize.x / 2,
            y: gameSize.y - this.size.x
        };
        this.keyboarder = new KeyBoarder();
    };

    // add methods here
    Player.prototype = {
        update: function () {
            
            if (this.keyboarder.isDown(this.keyboarder.KEYS.ESCAPE)) {
                window.close();
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
                this.center.x -= 2;
            } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
                this.center.x += 2;
            }

            if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
                var bullet = new Bullet({
                    x: this.center.x,
                    y: this.center.y - (this.size.y / 2)
                }, {
                    x: 0,
                    y: -6
                });

                this.game.addBody(bullet);
            }
        },

    };

    // BULLET CONSTRUCTOR
    var Bullet = function (center, velocity) {
        this.size = {
            x: 3,
            y: 3
        };
        this.center = center;
        this.velocity = velocity;
    };

    // add methods here
    Bullet.prototype = {
        update: function () {
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;
        },

    };

    // INVADER CONSTRUCTOR
    var Invader = function (game, center) {
        this.game = game;
        this.size = {
            x: 15,
            y: 15
        };
        this.center = center;
        this.patrolX = 0;
        this.speedX = 0.3;
    };

    // ADD METHODS HERE
    Invader.prototype = {
        update: function () {
            if (this.patrolX < 0 || this.patrolX > 40) {
                this.speedX *= -1;
            }

            this.center.x += this.speedX;
            this.patrolX += this.speedX;
        },
    };

    // main
    window.onload = function () {
        new Game("screen");
    };

})();