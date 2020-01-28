class PuddleJumper extends Entity {
	constructor(game, x, y)
	{
		super(game, x, y);
		
		this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"), STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH, {x: 0, y: 0}, {x: 2, y: 5}, 12, true, 5);
		this.speed = 100;
		this.radius = 20;
		
		this.set == true;
		
		game.addEntity(this, "enemy");
	}
	update()
	{
		if(this.animation._elapsedTime > this.animation._totalTime * 14/32 &&
		   this.animation._elapsedTime < this.animation._totalTime * 19/32)
		{
			this.speed = this.animation._scale * 110;
			this.y += this.game._clockTick * this.speed;
		}
	}
	
	init() // init gets called by Entity.constructor
	{
		this.animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"), 32, 32, {x: 0, y: 0}, {x: 2, y: 5}, 12, true, 5);
		this.speed = 100;
		this.radius = 20;
		
		if(this.set !== true)
		{
			game.addEntity(this, "enemy");
		}
	}
}