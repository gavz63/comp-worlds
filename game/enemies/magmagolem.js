class MagmaGolem extends Enemy {
    constructor(game, x, y, spawner, scale = 10, count = 0)
    {
      super(game, x, y, spawner);
      
      let towardsCenter = normalizeV(dirV({x: this.x, y: this.y}, {x: spawner.x, y: spawner.y}));
      while(this.wallCollision({x: this.x, y: this.y}))
      {
        console.log("HELLO WORLD: " + towardsCenter.x + ", " + towardsCenter.y);
        this.x += towardsCenter.x;
        this.y += towardsCenter.y;
      }
      
      this.oldPos = {x: this.x, y: this.y};

      
      let spriteSheet = game.AM.getAsset("./img/enemies/MagmaGolemSheet.png");
      this.myAddScale = scale;
      this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
      this.moveAnimation = new Animation(spriteSheet,
          STANDARD_ENTITY_FRAME_WIDTH,
          STANDARD_ENTITY_FRAME_WIDTH,
          {x: 0, y: 0}, {x: 3, y: 0}, 6, true, this.myScale);
      this.attackAnimation = new Animation(spriteSheet,
          STANDARD_ENTITY_FRAME_WIDTH,
          STANDARD_ENTITY_FRAME_WIDTH,
          {x: 4, y: 0}, {x: 3, y: 1}, 8, false, this.myScale);
      this.deathAnimation = new Animation(spriteSheet,
          STANDARD_ENTITY_FRAME_WIDTH,
          STANDARD_ENTITY_FRAME_WIDTH,
          {x: 4, y: 1}, {x: 2, y: 2}, 10, false, this.myScale);
      this.chargeAnimation = new Animation(spriteSheet,
          STANDARD_ENTITY_FRAME_WIDTH,
          STANDARD_ENTITY_FRAME_WIDTH,
          {x: 3, y: 2}, {x: 1, y: 3}, 8, true, this.myScale);

      this.animation = this.moveAnimation;

      this.speed = 20;
      this.collider = new Collider(0, 0, -28, 28, -30, 30, STANDARD_ENTITY_RADIUS * scale/2, 150); // 12,12,14,14
      //this.radius = STANDARD_ENTITY_RADIUS * scale/2;
      this.isWaiting = false;
      this.isAttacking = false;
      this.goalPoint = null;
      this.dir = null;
      this.maxHp = 80;
      this.hp = 80;
      this.wait();
      let numBars = 2;
      
      this.color = null;
		
      this.weight = 10;

      let healthScale = 0.9;
      if(scale !== 10)
      {
        this.hp = 25;
        this.maxHp = 25;
        healthScale /= numBars;
        this.healthBar = new HealthBar(this.game, this.game._ctx.canvas.width/(numBars * 2) + this.game._ctx.canvas.width/(numBars * 2) * (count*2), 100, healthScale, this, "lil' Buddy", count, numBars);
      }
      else
      {
        this.healthBar = new HealthBar(this.game, this.game._ctx.canvas.width/2, 100, healthScale, this, "SCOURGE OF THE EAST: MAGMA GOLEM");
      }
      
      this.destroySounds.push("golemDeath");
      
      this.hitSounds = [];
      this.hitSounds.push("golemHit1");
      this.hitSounds.push("golemHit2");
      this.hitSounds.push("golemHit3");
    }
    
    shockwave()
    {
      let shockwave = this.game.AM.getAsset("./img/projectiles/Shockwave.png");
      let shockwaveAnimation = new Animation(shockwave,
        128, 128,
        {x: 0, y: 0}, {x: 2, y: 0},
      8, true, STANDARD_DRAW_SCALE);
      
      new Shockwave(this.game, this.x + 96 * this.myAddScale / 10, this.y + 80 * this.myAddScale / 10, this, shockwaveAnimation, 5, 0, 10 * this.myAddScale / 10);
    }

    update() {
      super.update();
      this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

      if (!this.isWaiting) {
          if (this.isAttacking) {
              if (this.animation.isDone()) {
                  this.backToNormal();
                  this.wait();
              }
          } else {
              this.pathfind(1000000, 5000);
              if (this.isCharging) {
                  this.go(this.dir);
              } else if (this.goalPoint) {
                this.charge();
              }
              let newPos = {x: this.x, y: this.y};
              if (this.wallCollision(newPos)) {
                  this.x = this.oldPos.x;
                  this.y = this.oldPos.y;
                  
                  let towardsCenter = normalizeV(dirV({x: this.x, y: this.y}, {x: this.spawner.x, y: this.spawner.y}));
                  while(this.wallCollision({x: this.x, y: this.y}))
                  {
                    this.x += towardsCenter.x;
                    this.y += towardsCenter.y;
                  }
                  
                  this.oldPos = {x: this.x, y: this.y};
                  
                  this.attack();
              } else {
                  this.oldPos = newPos;
                  
              }
          }
      }
    }

    charge() {
      this.game.audioManager.playSound("golemCharge");
      this.goalPoint = {
          x: indexToCoordinate(coordinateToIndex(this.game.player.x)),
          y: indexToCoordinate(coordinateToIndex(this.game.player.y)),
      };
      this.dir = normalizeV(dirV(this, this.goalPoint));
      this.speed = 250;
      this.isCharging = true;
      this.animation = this.chargeAnimation;
      this.animation.resetAnimation();
      this.animation.unpause();
    }

    attack() {
      this.isAttacking = true;
      this.animation = this.attackAnimation;
      this.animation.resetAnimation();
      this.animation.unpause();
      this.attackTimer = null;
    }

    backToNormal() {
      this.game.audioManager.playSound("golemSlam1");
      this.game.audioManager.playSound("golemSlam2");
      this.game._camera.shake(10, 5, .5);
      
      this.shockwave();
      
      this.speed = 20;
      this.isCharging = false;
      this.isAttacking = false;
      this.animation = this.moveAnimation;
      this.animation.resetAnimation();
      this.goalPoint = null;
      this.dir = null;
    }

    wait() {
      this.isWaiting = true;
      let that = this;
      new TimerCallback(this.game, 0.25, false, function () {
          that.isWaiting = false;
      })
    }
    
     takeDamage(dmg, dir, knockBack)
    {
      if(!this.hurt)
      {
        if(!this.invincible)
        {
          console.log("HEY");
          let checkWalls = true;
          if(this.wallCollision({x: this.x, y: this.y}))
          {
            checkWalls = false;
          }
          
          this.x += dir.x * knockBack * 1/this.weight;
          this.y += dir.y * knockBack * 1/this.weight;
          
          if(checkWalls)
          {
            while(this.wallCollision({x: this.x, y: this.y}))
            {
              this.x -= dir.x * 0.5;
              this.y -= dir.y * 0.5;
            }
          }
          this.hp -= dmg;
          this.hurt = true;
          console.log(this.hurt);
          if (this.hp <= 0) {
            this.destroy();
          }
          else
          {
            this.game.audioManager.playSound(getRandomSound(this.hitSounds));
            let that = this;
            this.hurtTimer = new TimerCallback(this.game, 0.01, false, function() {that.hurt = false; });
            this.color = new Color(0, 100, 50).getColor();
            if(this.colorTimer) this.colorTimer.destroy();
            this.colorTimer = new TimerCallback(this.game, 0.25, false, function() {that.color = null;});
          }
        }
      }
    }
    
    draw()
    {
      this.animation._color = this.color;
      super.draw();
    }
    

	
	destroy()
	{
		super.destroy();
		if (this.hurtTimer) this.hurtTimer.destroy();
		if (this.colorTimer) this.colorTimer.destroy();
		this.healthBar.destroy();
		
		if(this.myAddScale === 10)
		{
			this.spawner.numOut += 2;
			//new MagmaGolem(this.game, this.x - this.animation._width * this.animation._scale / 8, this.y, this.spawner, 5, 0);
			//new MagmaGolem(this.game, this.x + this.animation._width * this.animation._scale / 8, this.y, this.spawner, 5, 1);
			new MagmaGolem(this.game, this.x - this.animation._width * this.animation._scale / 8, this.y + this.animation._height * this.animation._scale / 4, this.spawner, 5, 0);
			new MagmaGolem(this.game, this.x + this.animation._width * this.animation._scale / 8, this.y + this.animation._height * this.animation._scale / 4, this.spawner, 5, 1);
		}
		else
		{
			this.spawner.numOut += 4;
			new StoneGolem(this.game, this.x - this.animation._width * this.animation._scale / 8, this.y, this.spawner);
			new StoneGolem(this.game, this.x + this.animation._width * this.animation._scale / 8, this.y, this.spawner);
			new StoneGolem(this.game, this.x - this.animation._width * this.animation._scale / 8, this.y + this.animation._height * this.animation._scale / 4, this.spawner);
			new StoneGolem(this.game, this.x + this.animation._width * this.animation._scale / 8, this.y + this.animation._height * this.animation._scale / 4, this.spawner);
		}
	}
}