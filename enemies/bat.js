class Bat extends Entity
{
	constructor(game, x, y)
	{
		super(game, x, y);
		//console.log("BAT");
		this._myScale = [2 * STANDARD_DRAW_SCALE];
		this.animation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);
		this.speed = 100;
		this.radius = STANDARD_ENTITY_RADIUS;

		game.addEntity(this, "enemy");
	}

	update()
	{
		this.x += 2;
		this.y += 2;
		this._myScale[0] = 2 * STANDARD_DRAW_SCALE;
	}
}