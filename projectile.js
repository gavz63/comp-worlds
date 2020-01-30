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
		new TimerCallBack(this.game, lifetime, false, function() {	that.destroy();	});
		
		this.ctx = game.ctx;
		this.owner = owner;
		
		this.animation = animation;
		this.animation.resetAnimation();
		
		this.dmg = dmg;
		this.radius = radius;
    
    this.attachedToOwner = false;
    
		this.game.addEntity(this, "pps");
	}

	update() 
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
				if (circleToCircle(that, elem)) {
					that.destroy();
					elem.destroy();
				}
			});
		}
    
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
  
  draw()
  {
		let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
		
		this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
  }
  
  setAttachedToOwner(set)
  {
    this.attachedToOwner = set;
  }
  
}
