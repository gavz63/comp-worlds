function Projectile(game, x, y, dir, speed, lifetime, owner, animation) {
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
    this.animation.setFrame(0);
    this.dir = dir;
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