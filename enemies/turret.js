class Turret extends Entity {	
	constructor(game, x, y)
	{
		super(game, x, y);
		this.rotation = 0;
		this.timer = null;
		this.fireRate = 6;
		this.lastShotTime = 0;
		
		this.projectileSprite = game.AM.getAsset("./img/projectiles/Fireball.png");
		
		this.projectileAnimation = new Animation(this.projectileSprite,
        STANDARD_ENTITY_FRAME_WIDTH * 0.5, STANDARD_ENTITY_FRAME_WIDTH * 0.5,
        {x: 0, y: 0}, {x: 3, y: 0},
        6, true, STANDARD_DRAW_SCALE);
		
		this.attack = this.crossShot;
		
		let that = this;
		
		this.attackTimer = new TimerCallback(this.game, 1/this.fireRate, true, function() { that.attack(); });
	}
	
	update()
	{
		//this.attack();
	}
	
	draw()
	{
	}
	
	spiralShot()
	{
		if(this.timer === null)
		{
			this.timer = new Timer(this.game, 4, true);
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
	
	crossShot()
	{
		if(this.timer === null)
		{
			this.timer = new Timer(this.game, 3, true);
		}
		this.lastShotTime = this.timer.getPercent();
		if(this.timer.getPercent() > 0.5)
		{
			this.rotation = Math.PI/4;
		}
		else
		{
			this.rotation = 0;
		}
		let dir1 = {
			x: Math.cos(this.rotation + Math.PI * 1/4),
			y: Math.sin(this.rotation + Math.PI * 1/4)
		};
		let dir2 = {
			x: Math.cos(this.rotation + Math.PI * 3/4),
			y: Math.sin(this.rotation + Math.PI * 3/4)
		};
		let dir3 = {
			x: Math.cos(this.rotation + Math.PI * 5/4),
			y: Math.sin(this.rotation + Math.PI * 5/4)
		};
		let dir4 = {
			x: Math.cos(this.rotation + Math.PI * 7/4),
			y: Math.sin(this.rotation + Math.PI * 7/4)
		};
		new Projectile(this.game, this.x, this.y, dir1, 100, 2, this, this.projectileAnimation, 1, 5);
		new Projectile(this.game, this.x, this.y, dir2, 100, 2, this, this.projectileAnimation, 1, 5);
		new Projectile(this.game, this.x, this.y, dir3, 100, 2, this, this.projectileAnimation, 1, 5);
		new Projectile(this.game, this.x, this.y, dir4, 100, 2, this, this.projectileAnimation, 1, 5);
	}
}
