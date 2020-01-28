function PuddleJumper(game, x, y) {
	Entity.call(this, game, x, y);
	this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"),
		STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
		{x: 0, y: 0}, {x: 2, y: 5},
		12, true, 5);
    this.speed = 100;
    this.radius = 20;
	
	this.set = true;
}

PuddleJumper.prototype = new Entity();
PuddleJumper.prototype.constructor = PuddleJumper;

PuddleJumper.prototype.update = function () {
	if(this.animation._elapsedTime > this.animation._totalTime * 14/32 &&
	   this.animation._elapsedTime < this.animation._totalTime * 19/32)
	{
		this.speed = this.animation._scale * 110;
		this.y += this.game._clockTick * this.speed;
	}
}

PuddleJumper.prototype.init = function (game, x, y) {
	this.game = game;
	this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"),
		STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
		{x: 0, y: 0}, {x: 2, y: 5},
		12, true, 5);
    this.x = x;
    this.y = y;
    this.speed = 100;
}
