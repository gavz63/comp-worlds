function Bat(game, x, y) {
	this.animation = new Animation(game.AM.getAsset("./img/Bat.png"), 32, 32, {x: 0, y: 0}, {x: 3, y: 0}, 10, true, 5);
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
	this.radius = 20;

	this.set = true;
	
	console.log("Created Bat!");
}

Bat.prototype = new Entity();
Bat.prototype.constructor = Bat;

Bat.prototype.draw = function () {
    this.animation.drawFrame(this.game._clockTick, this.game.ctx, this.x, this.y, true);
}

Bat.prototype.update = function () {
	console.log("BAT");
	this.x += 2;
	this.y += 2;
}

// Important for spawned enemies this is effectively a second constructor.
Bat.prototype.init = function(game, x, y)
{
	if(this.set !== true)
	{
		this.animation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"), 32, 32, {x: 0, y: 0}, {x: 3, y: 0}, 10, true, 5);
		this.x = x;
		this.y = y;
		this.speed = 100;
		this.game = game;
		this.ctx = game.ctx;
		
		this.set = true;
	}
}