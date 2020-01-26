function Player(game) {
	this.animations = {walkLeft: 0, attackLeft: 0, walkRight: 0, attackRight: 0, walkUp: 0, attackUp: 0, walkDown: 0, attackDown: 0};
    this.x = 0;
    this.y = 0;
    this.speed = 300;
    this.game = game;
	this.velocity = {x: 0, y: 0};
	
	this.loadLeftRight(this.game.AM.getAsset("./img/player_characters/BlackMageSideToSideSheet.png"));
	this.loadUpDown(this.game.AM.getAsset("./img/player_characters/BlackMageUpDownSheet.png"));
}

Player.prototype.loadLeftRight = function (spritesheet) {
	this.animations.walkLeft = 			new Animation(spritesheet, 32, 32, {x: 0, y: 1}, {x: 5, y: 1}, 10, true, 10);
	this.animations.attackLeft =		new Animation(spritesheet, 32, 32, {x: 0, y: 2}, {x: 3, y: 2}, 10, true, 10);
	this.animations.walkRight = 		new Animation(spritesheet, 32, 32, {x: 0, y: 5}, {x: 5, y: 5}, 10, true, 10);
	this.animations.attackRight = 		new Animation(spritesheet, 32, 32, {x: 0, y: 6}, {x: 3, y: 6}, 10, true, 10);
}

Player.prototype.loadUpDown = function (spritesheet)
{
	this.animations.walkUp = 		new Animation(spritesheet, 32, 32, {x: 0, y: 1}, {x: 5, y: 1}, 10, true, 10);
	this.animations.attackUp = 		new Animation(spritesheet, 32, 32, {x: 0, y: 2}, {x: 3, y: 2}, 10, true, 10);
	this.animations.walkDown = 		new Animation(spritesheet, 32, 32, {x: 0, y: 5}, {x: 5, y: 5}, 10, true, 10);
	this.animations.attackDown = 	new Animation(spritesheet, 32, 32, {x: 0, y: 6}, {x: 3, y: 6}, 10, true, 10);
	this.animations.idle =			new Animation(spritesheet, 32, 32, {x: 0, y: 4}, {x: 5, y: 4}, 10, true, 10);
	this.animation = this.animations.idle;
}

Player.prototype.draw = function () {
	if(this.game.change)
	{
		if(this.game.keyStack.length > 0)
		{
			this.animation.unpause();
			if(this.idleTimer != null)
			{
				this.idleTimer.pause();
				this.idleTimer.reset();
			}
			console.log(this.game.lastKey);
			if(this.game.lastKey === "KeyW")
			{
				this.animation = this.animations.walkUp;
			}
			else if(this.game.lastKey === "KeyA")
			{
				this.animation = this.animations.walkLeft;
			}
			else if(this.game.lastKey === "KeyS")
			{
				this.animation = this.animations.walkDown;
			}
			else if(this.game.lastKey === "KeyD")
			{
				this.animation = this.animations.walkRight;
			}
		}
		else
		{
			var that = this;
			console.log("Once");
			this.animation = this.animations.idle;
			this.idle();
			if(this.idleTimer == null)
			{
				console.log("HEY");
				this.idleTimer = new TimerCallBack(this.game, 5, true, function () {return that.idle();}); // Had to do it this way to preserve the this identity.
				this.game.addTimer(this.idleTimer);
			}
			this.idleTimer.unpause();

		}
		this.game.change = false;
	}
	//console.log(this.x);
    this.animation.drawFrame(this.game._clockTick, this.game.ctx, this.x, this.y, false);
}

Player.prototype.update = function () {

	this.velocity = {x: 0, y: 0};
	if(this.game.w === true)
	{
		this.velocity.y = -1;
	}
	if(this.game.a === true)
	{
		this.velocity.x = -1;
	}
	if(this.game.s === true)
	{
		this.velocity.y = 1;
	}
	if(this.game.d === true)
	{
		this.velocity.x = 1;
	}
	this.velocity = scaleV(normalizeV(this.velocity), this.speed);

	this.game._camera.x += this.velocity.x * this.game._clockTick; //
	this.game._camera.y += this.velocity.y * this.game._clockTick; // Always move the camera
	
	this.x = this.game.ctx.canvas.width/2; // keep player centered
	this.y = this.game.ctx.canvas.height/2;

	//this.x += this.velocity.x * this.game._clockTick;
	//this.y += this.velocity.y * this.game._clockTick;

	/*first crack at the bounding box
	let scrolling = false;
	
	if(this.x > this.game.ctx.canvas.width * 2/3)
	{
		scrolling = true;
		this.x = this.game.ctx.canvas.width * 2/3;
	}
	if(this.x < this.game.ctx.canvas.width * 1/3)
	{
		scrolling = true;
		this.x = this.game.ctx.canvas.width * 1/3;
	}
	if(this.y > this.game.ctx.canvas.height * 2/3)
	{
		scrolling = true;
		this.y = this.game.ctx.canvas.height * 2/3;
	}
	if(this.y < this.game.ctx.canvas.height * 1/3)
	{
		scrolling = true;
		this.y = this.game.ctx.canvas.height * 1/3;
	}
	
	if(scrolling === true)
	{
		this.game._camera.x += this.velocity.x * this.game._clockTick;
		this.game._camera.y += this.velocity.y * this.game._clockTick;
	}
	bounding camera*/
	
	if(this.game.click === true)
	{
		this.game.click = false;
		console.log("Creating Projectile at: " + this.x + ", " + this.y);
		let projectile = new Projectile(this.game, this.x, this.y, normalizeV(dirV(this.animation.getCenter(this.x, this.y), {x: this.game.mouseX, y: this.game.mouseY})), 1000, 0.5);
		this.game.addEntity(projectile, "pps");
	}
	
	//this.game._camera.x += this.x;
	//this.game._camera.y += this.y;
	
}

Player.prototype.idle = function() {
	console.log("Idle: " + this.animation._paused);
	if(this.animation._paused === true)
	{
		this.animation.unpause();
	}
	else
	{
		this.animation.setFrame(0);
		this.animation.pause();
	}
}