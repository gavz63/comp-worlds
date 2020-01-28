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
function Projectile(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius) {
	Entity.call(this, game, x, y);

    let choice = Math.ceil((Math.random() * 3) + 0.5) - 1;
    this.animation = animation;
    this.animation.resetAnimation();
    this.dir = dir;
    this.radius = 1;
    this.speed = speed;
    this.ctx = game.ctx;
    this.dmg = dmg;
    this.owner = owner;
    this.x = x;
    this.y = y;

    let that = this;
    
    this.game.addTimer(new TimerCallBack(this.game, lifetime, false, function () {
        that.destroy();
    }));
}

Projectile.prototype = new Entity();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function () {
    // AAAAAAAAAAAAHHHHHHHHHHHHHHHHHHHH
    var that = this;
    if (this.owner instanceof Player) {
        //For each enemy
        this.game.entities[1].forEach(function(elem) {
            if (circleToCircle(that, elem)) {
                that.removeFromWorld = true;
                elem.removeFromWorld = true;
            }
        });
    }

    this.x += this.dir.x * this.game._clockTick * this.speed;
    this.y += this.dir.y * this.game._clockTick * this.speed;
};