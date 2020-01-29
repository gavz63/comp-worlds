class Bat extends Entity
{
	constructor(game, x, y)
	{
		super(game, x, y);
		this._myScale = [2 * STANDARD_DRAW_SCALE];
    
    this._myScale[0] = 2 * STANDARD_DRAW_SCALE;
    
		this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);
    this.attackAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 1}, {x: 3, y: 1}, 10, true, this._myScale);
    this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 2}, {x: 3, y: 2}, 10, false, this._myScale);
    
    this.animation = this.moveAnimation;

		this.speed = 100;
		this.radius = STANDARD_ENTITY_RADIUS;

		game.addEntity(this, "enemy");
	}

	update()
	{
    this.x += 2;
    this.y += 2;
	}
  
  destroy()
  {
    super.destroy();
    new Remnant(this.game, this.x, this.y, this.deathAnimation);
  }
}