const STANDARD_ENTITY_FRAME_WIDTH = 32;
const STANDARD_ENTITY_RADIUS = 20;
function Entity(game, x, y) {
    this.game = game;
	this.animation = null;
    this.x = x;
    this.y = y;
	this.id = 0;
    this.removeFromWorld = false;
	this.speed = 100;
	
	this.circle = false;
	this.radius = 10;
}

Entity.prototype.setAnimation = function(spritesheet)
{
	this.animation = new Animation(spritesheet,
		STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
		{x: 0, y: 0}, {x: 0, y: 0},
		0, true, 10);
};

Entity.prototype.destroy = function() {
	this.removeFromWorld = true;
};

Entity.prototype.update = function () {
};

Entity.prototype.draw = function () {
    let worldPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
    
    this.animation.drawFrame(this.game._clockTick, this.game.ctx, worldPos.x, worldPos.y, true);
};

Entity.prototype.init = function(game, x, y)
{
	if(this.set !== true)
	{
		this.game = game;
		this.animation = null;
		this.x = x;
		this.y = y;
		this.id = 0;
		this.removeFromWorld = false;
		this.speed = 100;
		
		this.circle = false;
		this.radius = 10;
		
		this.set = true;
	}
};