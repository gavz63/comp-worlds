function PuddleJumper(game, x, y) {
	Entity.call(this, game, 0, 0);
	this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"), 32, 32, {x: 0, y: 0}, {x: 2, y: 5}, 12, true, 5);
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.game = game;
    this.ctx = game.ctx;
	
	this.set = true;
}

PuddleJumper.prototype = new Entity();
PuddleJumper.prototype.constructor = PuddleJumper;

PuddleJumper.prototype.draw = function () {
    this.animation.drawFrame(this.game._clockTick, this.ctx, this.x, this.y, true);
}

PuddleJumper.prototype.update = function () {
	if(this.animation._elapsedTime > this.animation._totalTime * 14/32 &&
	   this.animation._elapsedTime < this.animation._totalTime * 19/32)
	{
		this.speed = this.animation._scale * 110;
		this.y += this.game._clockTick * this.speed;
	}
	
	//this.animation._scale = smoothStartN(clampBottom(this.y)/ 700, 3) * 10 + .1;
}

PuddleJumper.prototype.init = function (game, x, y) {
	this.game = game;
	this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"), 32, 32, {x: 0, y: 0}, {x: 2, y: 5}, 12, true, 5);
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.ctx = game.ctx;
}

