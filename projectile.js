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
 * @constructor
 */
function Projectile(game, x, y, dir, speed, lifetime, owner, animation, dmg, radius) {
    // var lightningBalls = [];
    // lightningBalls.push(new Animation(game.AM.getAsset("./img/projectiles/BallPulseBlue.png"), 32, 32, {
    //     x: 0,
    //     y: 0
    // }, {x: 3, y: 0}, 10, true, 5));
    // lightningBalls.push(new Animation(game.AM.getAsset("./img/projectiles/BallPulseRed.png"), 32, 32, {
    //     x: 0,
    //     y: 0
    // }, {x: 3, y: 0}, 10, true, 5));
    // lightningBalls.push(new Animation(game.AM.getAsset("./img/projectiles/BallPulseGreen.png"), 32, 32, {
    //     x: 0,
    //     y: 0
    // }, {x: 3, y: 0}, 10, true, 5));

    Entity.call(this, game, x, y);

    let choice = Math.ceil((Math.random() * 3) + 0.5) - 1;
    this.animation = animation;
    /*if(choice < 3)
    {
        this.animation = lightningBalls[choice];
    }*/
    this.animation.resetAnimation();
    this.dir = dir;
    this.radius = radius;
    this.speed = speed;
    this.ctx = game.ctx;

    this.game.addTimer(new TimerCallBack(this.game, lifetime, false, function () {
        this.destroy();
    }));
}

Projectile.prototype = new Entity();
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function () {
    this.x += this.dir.x * this.game._clockTick * this.speed;
    this.y += this.dir.y * this.game._clockTick * this.speed;
};