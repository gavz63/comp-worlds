/**
 * @author Joel Johnson, Gavin Montes, Gordon McCreary
 * Fires a projectile from an origin point along a vector.
 * @param game a reference to the game engine.
 * @param x the origin point's x value
 * @param y the origin point's y value
 * @param dir a VECTOR direction (not a UP,DOWN, LEFT, RIGHT direction)
 * @param speed, the speed the projectile will travel
 * @param lifetime, how long in ms before the projectile is destroyed.
 * @param owner, a reference to the player or enemy that fired the projectile.
 * @param animation, the projectile's animation.
 * @param dmg, the amount of damage the projectile does on hit.
 * @param radius, the radius of the projectile (used in collision)
 * @constructor
 */
class Projectile extends Entity
{
	constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius)
	{
		super(game, x, y);

		this.startX = x;
		this.startY = y;
		
		this.dx = 0;
		this.dy = 0;
		
		this.dir = dir;
		this.speed = speed;
		
		var that = this;
		this.timer = new TimerCallback(this.game, lifetime, false, function() {	that.destroy();	});
		
		this.ctx = game.ctx;
		this.owner = owner;
		
		this.animation = animation;
		this.animation.resetAnimation();
		
		this.dmg = dmg;
		this.radius = radius;
		
		this.attachedToOwner = false;
		this.dieOnHit = true;
		
		this.game.addEntity(this, "pps");
	}

	update() 
	{
    this.testCollision();
  
		this.dx += this.dir.x * this.game._clockTick * this.speed;
		this.dy += this.dir.y * this.game._clockTick * this.speed;
		
			if(this.attachedToOwner)
		{
		  this.x = this.owner.x + this.dir.x * this.speed;
		  this.y = this.owner.y + this.dir.y * this.speed;
		}
		else
		{
		  this.x = this.startX + this.dx;
		  this.y = this.startY + this.dy;
		}
	}
  
  testCollision()
  {
    var that = this;
    
		if(this.animation.isDone())
		{
		  this.animation.pause();
		  this.animation.setFrame(this.animation.getLastFrameAsInt());
		}
		
    if (this.owner instanceof Player) {
      //For each enemy
      this.game.entities[1].forEach(function(elem) {
    if(that.removeFromWorld !== true)
    {
      if (circleToCircle(that, elem)) {
      if(that.dieOnHit)
      {
        that.destroy();
      }
      elem.destroy();
      }
    }
      });
    }
		else
		{
		  if(circleToCircle(that, that.game.player))
		  {
			let attackedFromVector = normalizeV(dirV({x: this.x, y: this.y}, {x: this.game.player.x, y: this.game.player.y}));
			let attackedFromDir = vectorToDir(attackedFromVector);
			this.game.player.takeDmg(1, attackedFromDir);
		  }
		}
  }
  
  draw()
  {
		let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
		
		this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
  }
  
  setAttachedToOwner(set)
  {
    this.attachedToOwner = set;
    if(set === true)
    {
      this.dieOnHit = false;
    }
  }
  
}

class EasingProjectile extends Projectile
{
  	constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius, move, easing)
    {
      super(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius);
      
      this.parentX = x;
      this.parentY = y;

      this.move = move;
      this.easing = easing;

    }
    
    update()
    {
      this.testCollision();
      this.move();
    }
    
    line()
    {
      let t = this.easing(this.timer.getPercent());
      this.x = this.parentX + t * this.dir.x * this.speed;
      this.y = this.parentY + t * this.dir.y * this.speed;
    }
    
    circle()
    {
      let t = this.easing(this.timer.getPercent());
      let circle = Math.atan2(this.dir.y, this.dir.x);
      console.log(circle);
      this.x = this.parentX + Math.cos(circle + t * 2 * Math.PI) * this.speed;
      this.y = this.parentY + Math.sin(circle + t * 2 * Math.PI) * this.speed;
    }
    
    spiral()
    {
      let t = this.easing(this.timer.getPercent());
      let circle = Math.atan2(this.dir.y, this.dir.x);
      console.log(circle);
      this.x = this.parentX + Math.cos(circle + t * 2 * Math.PI) * this.speed * t;
      this.y = this.parentY + Math.sin(circle + t * 2 * Math.PI) * this.speed * t;
    }
    
}