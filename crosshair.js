class Crosshair
{
	constructor(game)
	{
		this.animation = new Animation(game.AM.getAsset("./img/hud/Crosshair.png"),
			STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 1, y: 0},
			0, true, 5);
		this.x = 800 - 64;
		this.y = 64;
		this.game = game;
		
		game.setReticle(this);
	}

	draw()
	{
		this.animation.drawFrame(this.game.clockTick, this.game._ctx, this.x, this.y, true);
	}

	update(x, y)
	{
		this.x = x;
		this.y = y;
	}
}