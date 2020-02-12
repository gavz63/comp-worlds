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
class Projectile extends Entity {
    constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius) {
        super(game, x, y);

        this.startX = x;
        this.startY = y;

        this.dx = 0;
        this.dy = 0;

        this.dir = dir;
        this.speed = speed;

        this.collider = new Collider(0, 0, -7, 7, -7, 8, null, 150);
        this.lifetime = lifetime;
        var that = this;
        this.timer = new TimerCallback(that.game, that.lifetime, false, function () {
            that.destroy();
        });
        this.ctx = game.ctx;
        this.owner = owner;

        this.animation = animation;
        this.animation.resetAnimation();

        this.dmg = dmg;
        this.radius = radius;

        this.attachedToOwner = false;
        this.dieOnHit = true;

        if (this.owner === this.game.player) {
            this.game.addEntity(this, LAYERS.PLAYER_PROJECTILES);
        } else {
            this.game.addEntity(this, LAYERS.ENEMY_PROJECTILES);
        }
    }

    update() {
        this.testCollision();

        this.dx += this.dir.x * this.game._clockTick * this.speed;
        this.dy += this.dir.y * this.game._clockTick * this.speed;

        if (this.attachedToOwner) {
            this.x = this.owner.x + this.dir.x * this.speed;
            this.y = this.owner.y + this.dir.y * this.speed;
        } else {
            this.x = this.startX + this.dx;
            this.y = this.startY + this.dy;
        }
        
        let newPos = {x: this.x, y: this.y};
        if(this.wallCollision(newPos))
        {
          this.destroy();
        }
        else
        {
          this.oldPos = newPos;
        }
    }

    testCollision() {
        var that = this;

        if (this.animation.isDone()) {
            this.animation.pause();
            this.animation.setFrame(this.animation.getLastFrameAsInt());
        }

        if (this.owner instanceof Player) {
            //For each enemy
            this.game.entities[LAYERS.ENEMIES].forEach(function (elem) {
                if (that.removeFromWorld !== true) {
                    if (circleToCircle(that, elem)) {
                        if (that.dieOnHit) {
                            that.destroy();
                        }
                        elem.destroy();
                    }
                }
            });
        } else {
            if (circleToCircle(that, that.game.player)) {
                let attackedFromVector = normalizeV(dirV({x: this.x, y: this.y}, {
                    x: this.game.player.x,
                    y: this.game.player.y
                }));
                let attackedFromDir = vectorToDir(attackedFromVector);
                this.game.player.takeDmg(1, attackedFromDir);
            }
        }
    }

    draw() {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);

        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
    }

    setAttachedToOwner(set) {
        this.attachedToOwner = set;
        if (set === true) {
            this.dieOnHit = false;
        }
    }

}

class EasingProjectile extends Projectile {
    constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius, move, easing) {
        super(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius);

        this.parentX = x;
        this.parentY = y;

        this.move = move;
        this.easing = easing;

	    this.move();

    }

    update() {
        this.testCollision();
        this.move();
    }

    line() {
        let t = this.easing(this.timer.getPercent());
        this.x = this.parentX + t * this.dir.x * this.speed;
        this.y = this.parentY + t * this.dir.y * this.speed;
    }

    circle() {
        let t = this.easing(this.timer.getPercent());
        let circle = Math.atan2(this.dir.y, this.dir.x);
        this.x = this.parentX + Math.cos(circle + t * 2 * Math.PI) * this.speed;
        this.y = this.parentY + Math.sin(circle + t * 2 * Math.PI) * this.speed;
    }

    spiral() {
        let t = this.easing(this.timer.getPercent());
        let circle = Math.atan2(this.dir.y, this.dir.x);
        this.x = this.parentX + Math.cos(circle + t * 2 * Math.PI) * this.speed * t;
        this.y = this.parentY + Math.sin(circle + t * 2 * Math.PI) * this.speed * t;
    }

}

class SpawnerProjectile extends EasingProjectile {
  constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius, move, easing, timeToSpawn)
  {

    super(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius, move, easing);
    this.timeToSpawn = timeToSpawn;
    let that = this;
    this.spawnTimer = new TimerCallback(this.game, timeToSpawn, false,
    function () {
      if(!that.removeFromWorld)
      {
        let projectile = new SpawnerProjectile(that.game, that.x, that.y, that.dir, that.speed, that.lifetime, that, that.animation, that.dmg, that.radius, that.move, that.easing, that.timeToSpawn);
        projectile.setAttachedToOwner(true);
      }
    });
  }
  update()
  {
    this.testCollision();

    this.dx += this.dir.x * this.game._clockTick * this.speed;
    this.dy += this.dir.y * this.game._clockTick * this.speed;

    if (this.attachedToOwner) {
        this.x = this.owner.x + this.dir.x * this.speed;
        this.y = this.owner.y + this.dir.y * this.speed;
    } else {
        this.x = this.startX + this.dx;
        this.y = this.startY + this.dy;
    }
    
    let newPos = {x: this.x, y: this.y};
    if(this.wallCollision(newPos))
    {
      this.destroy();
    }
    else
    {
      this.oldPos = newPos;
    }
  }
  destroy()
  {
    this.removeFromWorld = true;
  }
}

class FlameWall extends EasingProjectile
{
	constructor(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius, move, easing, timeToSpawn, length)
	{
		this.count = 0;
		this.length = length;
		let that = this;
		this.spawnTimer = new TimerCallback(this.game, timeToSpawn, false,
			function()
			{
				if(that.count < that.length)
				{
					that.count++;
					for(let i = 0; i < that.count; i++)
					{
						
					}
				}
			}
		);
	}
}