class Bat extends Entity
{
	constructor(game, x, y)
	{
		super(game, x, y);
		console.log("BAT");
		var animation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"), STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH, {x: 0, y: 0}, {x: 2, y: 5}, 12, true, 5);
		this.animation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 3, y: 0}, 10, true, 5);
		this.speed = 100;
		this.radius = STANDARD_ENTITY_RADIUS;

		game.addEntity(this, "enemy");
	}

	update()
	{
		this.x += 2;
		this.y += 2;
	}
}

Bat.prototype.constructor = Bat;