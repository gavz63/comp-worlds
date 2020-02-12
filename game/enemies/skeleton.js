class Skeleton extends Enemy
{
	constructor(game, x, y, spawner)
	{
		super(game, x, y, spawner);
		this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonWalk.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 5, y: 0}, 10, true, STANDARD_DRAW_SCALE);
    this.attackAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonAttack.png"),
      STANDARD_ENTITY_FRAME_WIDTH,
      STANDARD_ENTITY_FRAME_WIDTH,
      {x: 0, y: 0}, {x: 3, y: 0}, 10, true, STANDARD_DRAW_SCALE);
    this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonDeath.png"),
      STANDARD_ENTITY_FRAME_WIDTH,
      STANDARD_ENTITY_FRAME_WIDTH,
      {x: 0, y: 0}, {x: 8, y: 0}, 10, false, STANDARD_DRAW_SCALE);
    
    this.animation = this.moveAnimation;

	this.speed = 75;
	this.radius = STANDARD_ENTITY_RADIUS;
    this.attackTimer = null;
    this.attacked = false;
    
    this.projectileAnimation = new Animation(game.AM.getAsset("./img/projectiles/BoneProjectile.png"),
      STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 3, y: 0}, 10, true, STANDARD_DRAW_SCALE);

	}

	update()
	{
    let skelPlayVector = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
    let attackVector = normalizeV(skelPlayVector);
    if(this.attackTimer === null)
    {
      if (lengthV(skelPlayVector) > 120) {
        this.animation = this.moveAnimation;
        this.x += attackVector.x * this.speed * this.game._clockTick;
        this.y += attackVector.y * this.speed * this.game._clockTick;
      }
      else
      {
        let that = this;
        this.attackTimer = new TimerCallback(this.game, 2, false,
          function () {
            that.attackTimer = null;
            that.attack();
          }); // Time before the enemy starts attacks
      }
    }
    else // attacking
    {
      if(this.animation.getFrame() === 3 && this.animation === this.attackAnimation)
      {
        if(this.attacked === false)
        {
          this.attacked = true;
          let projectile = new Projectile(this.game,
                this.x, this.y,
                attackVector,
                100, 2,
                this, this.projectileAnimation,
                1, 20);
		  //should transition to some idle animation here some day...
        }
      }
      else
      {
        if(this.attacked === true)
        {
          this.animation.pause();
          this.animation.resetAnimation();
          let that = this;
          new TimerCallback(this.game, 4, false, function() { that.animation.unpause(); }); // wait before next attack
        }
        this.attacked = false;
      }
    }
	}
  
  attack()
  {
    let that = this;
    this.animation = this.attackAnimation;
    this.animation.resetAnimation();
    this.attackTimer = new TimerCallback(this.game, 2, false, function() { that.attackTimer = null; }); // time enemy remains in the attack state regardless of distance
  }
}