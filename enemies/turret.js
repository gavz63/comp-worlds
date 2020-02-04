class Turret extends Entity {	
	constructor(game, x, y)
	{
		super(game, x, y);
		this.rotation = 0;
		this.timer = null;
		this.fireRate = 50;
		this.lastShotTime = 0;
		
		this.projectileSprite = game.AM.getAsset("./img/projectiles/Fireball.png");
		
		this.projectileAnimation = new Animation(this.projectileSprite,
        STANDARD_ENTITY_FRAME_WIDTH * 0.5, STANDARD_ENTITY_FRAME_WIDTH * 0.5,
        {x: 0, y: 0}, {x: 3, y: 0},
        6, true, STANDARD_DRAW_SCALE);
		
		this.attack = this.spiralShot;
		
		this.game.addEntity(this, "hud");
	}
	
	update()
	{
		this.attack();
	}
	
	draw()
	{
	}
	
	spiralShot()
	{
		if(this.timer === null)
		{
			this.timer = new Timer(this.game, 3, true);
		}
		this.rotation = this.timer.getPercent() * 2 * Math.PI;
		if(Math.abs(this.timer.getPercent() - this.lastShotTime) > 1/this.fireRate)
		{
			this.lastShotTime = this.timer.getPercent();
			let dir = {
				x: Math.cos(this.rotation),
				y: Math.sin(this.rotation)
			};
			new Projectile(this.game, this.x, this.y, dir, 100, 2, this, this.projectileAnimation, 1, 5);
		}
	}
}
