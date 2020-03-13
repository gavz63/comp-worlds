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
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback = 3, deathAnimation = null) {
        super(game, x, y);

        this.startX = x;
        this.startY = y;

        this.dx = 0;
        this.dy = 0;

        this.dir = dir;
        this.speed = speed;

        this.collider = new Collider(0, 0, 7, 7, 7, 8, radius, 150);
        this.lifetime = lifetime;
        this.dieOnHit = dieOnHit;

        var that = this;
        this.timer = new TimerCallback(that.game, that.lifetime, false, function () {
            that.destroy();
        });
        this.ctx = game.ctx;
        this.owner = owner;
        this.attached = null;

        this.animation = animation;
        this.animation.resetAnimation();

        this.deathAnimation = deathAnimation;

        this.dmg = dmg;
        this.knockBack = knockback;

        this.giveBackAmmo = false;

        if (this.owner === this.game.player) {
            this.game.addEntity(this, LAYERS.PLAYER_PROJECTILES);
        } else {
            this.game.addEntity(this, LAYERS.ENEMY_PROJECTILES);
        }

        this.myAddScale = this.animation._addScale;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];

        this.animation._scale = this.myScale;

        this.particleEmitter = null;

        this.hitSounds = [];
        this.dying = false;
        this.canReflect = true;
    }

    update() {
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
        if (this.attached === null) {
            this.testCollision();
        }

        this.dx += this.dir.x * this.game._clockTick * this.speed;
        this.dy += this.dir.y * this.game._clockTick * this.speed;

        if (this.attached !== null) {
            let direction = this.dir;
            if (this.owner === this.game.player) {
                direction = dirToVector(vectorToDir(this.dir));
            }
            this.x = this.attached.x + direction.x * this.speed;
            this.y = this.attached.y + direction.y * this.speed;
        } else {
            this.x = this.startX + this.dx;
            this.y = this.startY + this.dy;
        }

        let newPos = {x: this.x, y: this.y};
        if (this.wallCollision(newPos)) {
            this.destroy();
        } else {
            this.oldPos = newPos;
        }
    }

    testCollision() {
        if (this.game.player !== null) {
            var that = this;

            if (this.animation.isDone()) {
                this.animation.pause();
                this.animation.setFrame(this.animation.getLastFrameAsInt());
            }

            if (this.owner instanceof Player) {

                console.log(this.collider._radius);
                //For each enemy
                this.game.entities[LAYERS.ENEMIES].forEach(function (enemy) {
                    if (!that.removeFromWorld && !enemy.removeFromWorld &&
                        enemy.collider && that.collider &&
                        checkCollision(that, that.collider, enemy, enemy.collider)) {

                        if (that.dieOnHit) {
                            that.destroy();
                        }
                        enemy.takeDamage(that.dmg, that.dir, that.knockBack);
                    }
                });
            } else {
                if (!that.removeFromWorld && !that.game.player.removeFromWorld &&
                    that.collider && that.game.player._collider &&
                    checkCollision(that, that.collider, that.game.player, that.game.player._collider)) {
                    let attackedFromVector = normalizeV(dirV({x: this.x, y: this.y}, {
                        x: this.game.player.x,
                        y: this.game.player.y
                    }));
                    let attackedFromDir = vectorToDir(attackedFromVector);
                    this.game.player.takeDmg(1, attackedFromDir);
                    that.destroy();
                }
            }

            // Collide with objects regardless of owner
            this.game.entities[LAYERS.OBJECTS].forEach(function (object) {
                if (that.removeFromWorld !== true && object.removeFromWorld !== true &&
                    object.collider && that.collider &&
                    checkCollision(that, that.collider, object, object.collider)) {

                    if (that.dieOnHit) {
                        that.destroy();
                    }
                    that.done = true;
                    object.takeDamage(that.dmg, that.dir, that.knockBack);
                }
            });
        }
    }

    draw() {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);

        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
    }

    attachTo(attached) {
        this.attached = attached;
    }

    hitOnce() {
        let that = this;
        new TimerCallback(this.game, this.lifetime / 4, false, function () {
            that.testCollision();
        });
    }

    destroy() {
        this.dying = true;
        if (this.deathAnimation) {
            this.animation = this.deathAnimation;
            let that = this;

            this.update = function () {
            };
            if (that.giveBackAmmo) {
                that.owner.attackCounter--;
                that.giveBackAmmo = false;
                that.game.audioManager.playSound(getRandomSound(this.hitSounds));
            }

            new TimerCallback(this.game, 0, false, function () {
                if (that.animation.isDone()) {
                    if (!that.removeFromWorld) {
                        that.removeFromWorld = true;
                    }
                }
            });
        } else {
            if (!this.removeFromWorld) {
                this.removeFromWorld = true;
                if (this.giveBackAmmo) {
                    this.owner.attackCounter--;
                }
            }
        }
        if (this.particleEmitter) {
            this.particleEmitter.destroy();
        }
    }

    GiveBackAmmo() {
        this.giveBackAmmo = true;
    }

    wallCollision(newPos) {
        let dir = dirV(this.oldPos, newPos);
        let xOffset = 0;
        let yOffset = 0;

        let returnValue = this.game._sceneManager.level.quickProjectileCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
        //console.log(returnValue);
        if (returnValue === true) {
            return returnValue;
        }

        yOffset = this.collider._upHit;
        returnValue = this.game._sceneManager.level.quickProjectileCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
        if (returnValue === true) {
            return returnValue;
        }

        yOffset = this.collider._downHit;
        returnValue = this.game._sceneManager.level.quickProjectileCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
        if (returnValue === true) {
            return returnValue;
        }

        xOffset = this.collider._leftHit;
        returnValue = this.game._sceneManager.level.quickProjectileCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
        if (returnValue === true) {
            return returnValue;
        }

        xOffset = this.collider._rightHit;
        returnValue = this.game._sceneManager.level.quickProjectileCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
        if (returnValue === true) {
            return returnValue;
        }

        return false;
    }

}

class HomingProjectile extends Projectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback);
    }

    update() {
        let direction = dirV({x: this.x, y: this.y}, {x: this.game.player.x, y: this.game.player.y});
        direction = normalizeV(direction);
        this.x += direction.x * this.speed;
        this.y += direction.y * this.speed;

        this.testCollision();
    }

}

class EasingProjectile extends Projectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback);

        this.move = move;
        this.easing = easing;

        this.move();
    }

    update() {
        //console.log(this.myAddScale);
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
        this.testCollision();
        this.move();
    }

    line() {
        let t = this.easing(this.timer.getPercent());
        this.x = this.startX + t * this.dir.x * this.speed;
        this.y = this.startY + t * this.dir.y * this.speed;
    }

    circle() {
        let t = this.easing(this.timer.getPercent());
        let circle = Math.atan2(this.dir.y, this.dir.x);
        this.x = this.startX + Math.cos(circle + t * 2 * Math.PI) * this.speed;
        this.y = this.startY + Math.sin(circle + t * 2 * Math.PI) * this.speed;
    }

    spiral() {
        let t = this.easing(this.timer.getPercent());
        let circle = Math.atan2(this.dir.y, this.dir.x);
        this.x = this.startX + Math.cos(circle + t * 2 * Math.PI) * this.speed * t;
        this.y = this.startY + Math.sin(circle + t * 2 * Math.PI) * this.speed * t;
    }

}

class SpawnerProjectile extends EasingProjectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing, timeToSpawn, attach, shots, circleTime, loop, spawnDir) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing);
        this.startX = indexToCoordinate(x);
        this.startY = indexToCoordinate(y);
        this.timeToSpawn = timeToSpawn;
        this.attach = attach;
        this.shots = shots;
        this.circleTime = 0;
        let that = this;
        this.spawnTimer = new TimerCallback(this.game, timeToSpawn, true, function () {
            if (that.removeFromWorld !== true) that.spawn();
        });
        this.circleTimer = null;
        this.spawnDir = spawnDir;
        this.radius = -100;
        if (circleTime !== 0) {
            this.circleTimer = new Timer(this.game, circleTime, true);
        }
        this.loop = true;
        if (this.loop) {
            this.timer.destroy();
            this.timer = new Timer(that.game, that.lifetime, true);
        }
    }

    /*
    update()
    {
      this.dx += this.dir.x * this.game._clockTick * this.speed;
      this.dy += this.dir.y * this.game._clockTick * this.speed;

      this.x = this.startX + this.dx;
      this.y = this.startY + this.dy;

      let newPos = {x: this.x, y: this.y};
      if (this.wallCollision(newPos)) {
          this.destroy();
      } else {
          this.oldPos = newPos;
      }
    }*/

    spawn() {
        let t = 0;
        if (this.circleTimer !== null) {
            t = this.easing(this.circleTimer.getPercent());
        }
        let circle = 0;
        if (this.spawnDir.right) {
            for (let i = 0; i < this.shots; i++) {
                let a = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png"),
                    16, 16,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    6, true, STANDARD_DRAW_SCALE);
                let p = new Projectile(this.game, this.x, this.y, {
                    x: Math.cos(circle + t * 2 * Math.PI),
                    y: Math.sin(circle + t * 2 * Math.PI)
                }, i * 9.6, 1 / 50, true, this, a, 1, 1, 0);
                if (this.attach) p.attachTo(this);
            }
        }
        if (this.spawnDir.down) {
            for (let i = 0; i < this.shots; i++) {
                let a = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png"),
                    16, 16,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    6, true, STANDARD_DRAW_SCALE);
                let p = new Projectile(this.game, this.x, this.y, {
                    x: Math.cos(circle + (t + 0.25) * 2 * Math.PI),
                    y: Math.sin(circle + (t + 0.25) * 2 * Math.PI)
                }, i * 9.6, 1 / 50, true, this, a, 1, 1, 0);
                if (this.attach) p.attachTo(this);
            }
        }
        if (this.spawnDir.left) {
            for (let i = 0; i < this.shots; i++) {
                let a = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png"),
                    16, 16,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    6, true, STANDARD_DRAW_SCALE);
                let p = new Projectile(this.game, this.x, this.y, {
                    x: Math.cos(circle + (t + 0.5) * 2 * Math.PI),
                    y: Math.sin(circle + (t + 0.5) * 2 * Math.PI)
                }, i * 9.6, 1 / 50, true, this, a, 1, 1, 0);
                if (this.attach) p.attachTo(this);
            }
        }
        if (this.spawnDir.up) {
            for (let i = 0; i < this.shots; i++) {
                let a = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png"),
                    16, 16,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    6, true, STANDARD_DRAW_SCALE);
                let p = new Projectile(this.game, this.x, this.y, {
                    x: Math.cos(circle + (t + 0.75) * 2 * Math.PI),
                    y: Math.sin(circle + (t + 0.75) * 2 * Math.PI)
                }, i * 9.6, 1 / 50, true, this, a, 1, 1, 0);
                if (this.attach) p.attachTo(this);
            }
        }
    }

    destroy() {
        this.removeFromWorld = true;
    }
}

class Flame extends EasingProjectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing);
        this.myScale[0] = 0;
        this.animation._scale = this.myScale;

        let oppositeDir = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI + 180;

        let colors = [];

        colors.push(new Color(56, 80, 50));
        colors.push(new Color(19, 80, 50));

        colors.push(new Color(25, 100, 50));
        colors.push(new Color(10, 100, 50));

        colors.push(new Color(25, 100, 50));
        colors.push(new Color(10, 100, 50));

        colors.push(new Color(5, 100, 50));
        colors.push(new Color(20, 100, 50));

        colors.push(new Color(0, 100, 50));
        colors.push(new Color(5, 100, 50));

        colors.push(new Color(0, 70, 50));
        colors.push(new Color(0, 20, 10));

        colors.push(new Color(0, 0, 50));
        colors.push(new Color(0, 0, 50));

        this.particleEmitter = new ParticleEmitter(this.game, this.x, this.y,
            5,     // rate
            0, 360,   // pos
            0, 20, // pos Range
            oppositeDir + 40, oppositeDir - 40,   // dir
            1, 70,  // speed
            0.1, 2,   // lifeTime
            0.05, 0.07,   // size
            0.01, 0.05, // scale
            colors,   // color
            this);  // owner
    }

    update() {
        if (this.timer.getPercent() < 0.1) {
            this.testCollision();
        }
        this.move();
        this.myScale[0] = this.easing(this.timer.getPercent()) * 3 * STANDARD_DRAW_SCALE;

        if (this.timer.getPercent() > 0.1 && this.myScale[0] < 0.01) {
            this.particleEmitter.destroy();
            console.log("HEY");
            this.destroy();
        }

        let newPos = {x: this.x, y: this.y};
        if (this.wallCollision(newPos)) {
            console.log("destroy special projectile");
            this.destroy();
        } else {
            this.oldPos = newPos;
        }
    }
}

class FlameWall extends EasingProjectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing, timeToSpawn, length) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing);
        this.timeToSpawn = timeToSpawn;
        this.count = 1;
        this.length = length;
        let that = this;
        this.myScale[0] = 0;
        this.animation._scale = this.myScale;
        this.spawnTimer = new TimerCallback(this.game, timeToSpawn, true,
            function () {
                if (that.count < that.length) {
                    that.count++;
                    let perp = perpendicularV(that.dir);
                    let offsetX = (that.dir.x * (that.count - 1) - perp.x * (that.count - 1) / 2) * that.speed;
                    let offsetY = (that.dir.y * (that.count - 1) - perp.y * (that.count - 1) / 2) * that.speed;
                    for (let i = 0; i < that.count; i++) {
                        let animation = that.owner.characterClass.animation.specialProjectile();
                        new Flame(that.game, that.x + offsetX, that.y + offsetY, that.dir, that.speed, that.lifetime, that.dieOnHit, that.owner, animation, that.dmg, that.radius, that.knockBack, that.move, that.easing);
                        offsetX += perp.x * that.speed;
                        offsetY += perp.y * that.speed;
                    }
                } else {
                    this.destroy();
                }
            });
        let oppositeDir = Math.atan2(this.dir.y, this.dir.x) * 180 / Math.PI + 180;

        let colors = [];

        colors.push(new Color(25, 100, 50));
        colors.push(new Color(19, 100, 50));

        colors.push(new Color(5, 100, 50));
        colors.push(new Color(20, 100, 50));

        colors.push(new Color(0, 100, 50));
        colors.push(new Color(5, 100, 50));

        colors.push(new Color(0, 70, 50));
        colors.push(new Color(0, 20, 10));

        colors.push(new Color(0, 0, 50));
        colors.push(new Color(0, 0, 50));

        this.particleEmitter = new ParticleEmitter(this.game, this.x, this.y,
            3,     // rate
            0, 360,   // pos
            0, 10, // pos Range
            oppositeDir + 45, oppositeDir - 45,   // dir
            1, 50,  // speed
            0.1, 2,   // lifeTime
            0.05, 0.12,   // size
            0.01, 0.2, // scale
            colors,   // color
            this);  // owner

        this.game.audioManager.playSound("flame");
    }

    update() {
        this.myScale[0] = this.easing(this.timer.getPercent()) * 3 * STANDARD_DRAW_SCALE;

        if (this.timer.getPercent() > 0.25 && this.myScale[0] < 0.01) {
            this.destroy();
        }

        let newPos = {x: this.x, y: this.y};
        if (this.wallCollision(newPos)) {
            this.destroy();
        } else {
            this.oldPos = newPos;
        }
    }

    destroy() {
        this.removeFromWorld = true;
        this.owner.progressBar.paused = false;
        if (this.particleEmitter !== null) {
            this.particleEmitter.destroy();
        }
        this.spawnTimer.destroy();
    }
}

class Slash extends Projectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback);
        this.attached = owner;
        this.done = false;
    }

    update() {
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
        if (!this.hitOnce) {
            this.testCollision();
        }
        this.testProjectileCollision();

        this.x = this.owner.x + this.dir.x * this.speed;
        this.y = this.owner.y + this.dir.y * this.speed;
    }

    testProjectileCollision() {
        let that = this;
        if (this.owner instanceof Player) {
            this.game.entities[LAYERS.ENEMY_PROJECTILES].forEach(function (elem) {
                if (!that.removeFromWorld && !elem.removeFromWorld && elem.canReflect === true &&
                    that.collider && elem.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {
                    let p = new Projectile(that.game, elem.x, elem.y, that.dir, that.owner.characterClass.stats.projectileSpeed, 3, true, that.owner, elem.animation, elem.dmg, elem.radius, elem.knockBack);
                    elem.destroy();
                }
            });
        } else {
            this.game.entities[LAYERS.PLAYER_PROJECTILES].forEach(function (elem) {
                if (!that.removeFromWorld && !elem.removeFromWorld && elem.canReflect === true &&
                    that.collider && elem.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {
                    let p = new Projectile(that.game, elem.x, elem.y, that.dir, elem.speed, 3, true, that.owner, elem.animation, elem.dmg, elem.radius, elem.knockBack);
                    elem.destroy();
                }
            });
        }

    }

    destroy() {
        this.removeFromWorld = true;
        if (this.owner.progressBar) {
            this.owner.progressBar.paused = false;
        }
    }
}

class Shuriken extends EasingProjectile {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing, timeToSpawn) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback, move, easing, timeToSpawn);
        if (this.wallCollision({x: this.x, y: this.y})) {
            this.destroy();
        }
        this.timer.destroy();
        let that = this;
        this.timer = new TimerCallback(this.game, this.lifetime, false, function () {
            that.setDone();
        });
        this.done = false;

        this.knockBack = knockback;
    }

    update() {
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;

        if (!this.done) {
            this.move();

            let newPos = {x: this.x, y: this.y};
            let backDir = normalizeV(this.dir);
            while (this.wallCollision({x: this.x, y: this.y})) {
                this.x -= backDir.x;
                this.y -= backDir.y;
                this.setDone();
            }
            this.testCollision();
            this.oldPos = newPos;

        }
        this.testPlayerCollision();
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
                if (!that.done &&
                    !that.removeFromWorld && !elem.removeFromWorld &&
                    elem.collider && that.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {
                    if (that.dieOnHit) {
                        that.destroy();
                    } else {
                        let backDir = normalizeV(that.dir);
                        while (checkCollision(that, that.collider, elem, elem.collider)) {
                            that.x -= backDir.x;
                            that.y -= backDir.y;
                            that.setDone();
                        }
                    }
                    elem.takeDamage(that.dmg, that.dir, that.knockBack);
                }
            });
            this.game.entities[LAYERS.OBJECTS].forEach(function (elem) {
                if (!that.removeFromWorld && !elem.removeFromWorld &&
                    elem.collider && that.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {

                    if (that.dieOnHit) {
                        that.destroy();
                    } else {
                        let backDir = normalizeV(that.dir);
                        while (circleToCircle(that, elem)) {
                            console.log(backDir.x + ", " + backDir.y);
                            that.x -= backDir.x;
                            that.y -= backDir.y;
                            that.setDone();
                        }
                    }
                    elem.takeDamage(that.dmg, that.dir, that.knockBack);
                }
            });
        } else {
            if (!that.removeFromWorld && !that.game.player.removeFromWorld &&
                that.collider && that.game.player._collider &&
                checkCollision(that, that.collider, that.game.player, that.game.player._collider)) {
                let attackedFromVector = normalizeV(dirV({x: this.x, y: this.y}, {
                    x: this.game.player.x,
                    y: this.game.player.y
                }));
                let attackedFromDir = vectorToDir(attackedFromVector);
                this.game.player.takeDmg(1, attackedFromDir);
            }
        }
    }

    testPlayerCollision() {
        if ((this.done || this.timer.getPercent() > 0.3) &&
            this.collider && this.owner.collider &&
            checkCollision(this, this.collider, this.owner, this.owner.collider)) {
            this.destroy();
        }
    }

    setDone() {
        if (this.done === false) {
            this.game.audioManager.playSound(getRandomSound(this.hitSounds));

            this.timer.pause();
            this.timer.destroy();
            this.animation.setFrame(6);
            this.animation.pause();
            this.done = true;
            let that = this;
            new TimerCallback(this.game, this.lifetime * 0.5, false, function () {
                that.destroy();
            });
        }
    }
}

class Spin extends Slash {
    constructor(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback) {
        super(game, x, y, dir, speed, lifetime, dieOnHit, owner, animation, dmg, radius, knockback);
        this.collider = new Collider(0, 0, 64, 64, 64, 64, radius, 150);

        this.timer.destroy();
        let that = this;
        this.dmgTimer = new TimerCallback(that.game, 0.1, true, function () {
            that.testCollision();
        });
        this.timer = new TimerCallback(that.game, that.lifetime, false,
            function () {
                that.destroy();
                that.owner.velocity.x = 0;
                that.owner.velocity.y = 0;
                that.owner.speed = that.owner.characterClass.stats.speed;
                that.dmgTimer.destroy();
            }
        );
        this.attached = owner;
    }

    update() {
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
        this.testProjectileCollision();

        this.x = this.owner.x + this.dir.x * this.speed;
        this.y = this.owner.y + this.dir.y * this.speed;
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
                let direction = normalizeV(dirV({x: that.x, y: that.y}, {x: elem.x, y: elem.y}));
                if (!that.removeFromWorld && !elem.removeFromWorld &&
                    that.collider && elem.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {
                    if (that.dieOnHit) {
                        that.destroy();
                    }
                    elem.takeDamage(that.dmg, direction, that.knockBack);
                }
            });
            this.game.entities[LAYERS.OBJECTS].forEach(function (elem) {
                let direction = normalizeV(dirV({x: that.x, y: that.y}, {x: elem.x, y: elem.y}));
                if (!that.removeFromWorld && !elem.removeFromWorld &&
                    that.collider && elem.collider &&
                    checkCollision(that, that.collider, elem, elem.collider)) {
                    if (that.dieOnHit) {
                        that.destroy();
                    }
                    elem.takeDamage(that.dmg, direction, that.knockBack);
                }
            });
        }
    }

    testProjectileCollision() {
        let that = this;
        this.game.entities[LAYERS.ENEMY_PROJECTILES].forEach(function (elem) {
            if (!that.removeFromWorld && !elem.removeFromWorld &&
                that.collider && elem.collider &&
                checkCollision(that, that.collider, elem, elem.collider)) {
                elem.destroy();
            }
        });
    }

    destroy() {
        this.removeFromWorld = true;
        this.owner.progressBar.paused = false;
    }
}

class Peasant extends Entity {
    constructor(game, x, y, owner) {
        super(game, x, y);
        this.owner = owner;
        let peasantID = Math.floor(Math.random() * 5);
        this.animation = new Animation(game.AM.getAsset("./img/projectiles/Peasants.png"), 16, 16,
            {x: 0, y: peasantID}, {x: 1, y: peasantID}, 5, true, STANDARD_DRAW_SCALE);
        this.animation.unpause();
        this.speed = 100;
        this.hp = 1;
        this.dmg = 1;
        this.collider = new Collider(0, 0, 0, 0, 0, 0, 8, 5);
        this.radius = 8;
        this.game.addEntity(this, LAYERS.PLAYER_PROJECTILES);

        this.mobOff = {
            x: Math.cos(Math.floor(Math.random() * 360)) * 24,
            y: Math.sin(Math.floor(Math.random() * 360)) * 24
        };
        this.targOff = {x: Math.floor(Math.random() * 20) - 10, y: Math.floor(Math.random() * 20) - 10};
        this.precision = 1;
    }

    update() {

        if (this.game.player.dead || !(this.game.player.characterClass instanceof King) || this.game.game_state !== GAME_STATES.PLAYING) {
            this.removeFromWorld = true;
        }


        let target = {x: this.owner.x + this.mobOff.x, y: this.owner.y + this.mobOff.y};
        let dist = 200;
        let that = this;
        this.game.entities[LAYERS.ENEMIES].forEach((e) => {

            if (!that.removeFromWorld && !e.removeFromWorld &&
                that.collider && e.collider &&
                checkCollision(that, that.collider, e, e.collider)) {

                e.takeDamage(1, {x: 0, y: 0}, false);
                that.hp--;
                if (that.hp <= 0) {
                    that.destroy();
                    that.owner.attackCounter--;
                }
            }

            let eD = lengthV({x: e.x - that.x, y: e.y - that.y});
            if (eD < dist && lengthV({x: e.x - that.owner.x, y: e.y - that.owner.y}) < 250) {
                target.x = e.x + that.targOff.x;
                target.y = e.y + that.targOff.y;
                dist = eD;
            }
        });
        this.game.entities[LAYERS.ENEMY_PROJECTILES].forEach((p) => {

            if (!that.removeFromWorld && !p.removeFromWorld &&
                that.collider && p.collider &&
                checkCollision(that, that.collider, p, p.collider)) {
                p.destroy();
                that.hp--;
                if (that.hp <= 0) {
                    that.destroy();
                    that.owner.attackCounter--;
                }
            }


            let pD = lengthV({x: p.x - that.owner.x, y: p.y - that.owner.y});
            if (pD < dist) {
                target.x = p.x;
                target.y = p.y;
                dist = pD;
            }
        });

        this.game.entities[LAYERS.OBJECTS].forEach((p) => {

            if (!that.removeFromWorld && !p.removeFromWorld &&
                that.collider && p.collider &&
                checkCollision(that, that.collider, p, p.collider)) {
                p.takeDamage(1, normalizeV(dirV(that, p)), 0);
                that.hp--;
                if (that.hp <= 0) {
                    that.destroy();
                    that.owner.attackCounter--;
                }
            }


            let pD = lengthV({x: p.x - that.owner.x, y: p.y - that.owner.y});
            if (pD < dist) {
                target.x = p.x;
                target.y = p.y;
                dist = pD;
            }
        });

        if (lengthV({x: this.x - target.x, y: this.y - target.y}) > this.precision) {
            let attackVect = {x: target.x - this.x, y: target.y - this.y};
            attackVect = normalizeV(attackVect);
            this.x += attackVect.x * this.speed * this.game._clockTick;
            this.y += attackVect.y * this.speed * this.game._clockTick;
        }
    }
}

class Hail extends Entity {
    constructor(game, x, y, owner) {
        super(game, x, y);
        this.owner = owner;
        this.myAddScale = 2.5;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.animation = new Animation(game.AM.getAsset("./img/projectiles/Arrows.png"), 256, 256,
            {x: 0, y: 0}, {x: 4, y: 0}, 12, false, this.myScale);
        this.animation.unpause();
        this.dmg = 1;
        this.collider = new Collider(0, 0, 0, 0, 0, 0, 35 * 3, 35);
        this.game.addEntity(this, LAYERS.PLAYER_PROJECTILES);
        this.hit = false;
        this.grounded = 0;
    }

    update() {
        if (!this.hit && this.animation.isDone()) {
            this.animation.pause();
            this.animation.setFrame(4);
            this.hit = true;
            let that = this;
            this.game.entities[LAYERS.ENEMIES].forEach((e) => {
                if (!that.removeFromWorld && !e.removeFromWorld &&
                    that.collider && e.collider &&
                    checkCollision(that, that.collider, e, e.collider)) {
                    e.takeDamage(10, {x: 0, y: 0}, false);
                }
            });
            this.game.entities[LAYERS.OBJECTS].forEach((e) => {
                if (!that.removeFromWorld && !e.removeFromWorld &&
                    that.collider && e.collider &&
                    checkCollision(that, that.collider, e, e.collider)) {
                    e.destroy();
                }
            });
        }

        if (this.hit) {
            this.grounded += this.game._clockTick;
            if (this.grounded >= 2) {
                this.destroy();
                this.owner.progressBar.paused = false;
            }
        }
    }

    draw(ctx) {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true, .5);
    }
}

class LogProjectile extends Projectile {
    constructor(game, x, y, dir, owner) {
        let animation = null;
        let collider = null;
        if (dir.x > 0) {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingHorizontal.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 1, y: 0}, 10, true, STANDARD_DRAW_SCALE, 2);
            collider = new Collider(0, 0,
                8 * 2, 8 * 2,
                16 * 2, 16 * 2,
                null, Infinity);
        } else {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingVertical.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 2, y: 0}, 10, true, STANDARD_DRAW_SCALE, 2);
            collider = new Collider(0, 0,
                16 * 2, 16 * 2,
                6 * 2, 6 * 2,
                null, Infinity);
        }
        super(game, x, y, dir, 200, Infinity, false, owner, animation, 0, null, 10);
        this.collider = collider;
        this.dir = dir;
    }

    testCollision() {
        let that = this;
        this.game.entities[LAYERS.OBJECTS].forEach(function (elem) {
            if (elem.collider && checkCollision(that, that.collider, elem, elem.collider)) {
                that.destroy();
            }
        });
        while (!this.removeFromWorld && checkCollision(this, this.collider, this.game.player, this.game.player._collider)) {
            let vec = normalizeV(dirV(this, this.game.player));
            this.game.player.x += vec.x;
            this.game.player.y += vec.y;
            if (this.game.player.wallCollision(this.game.player)) {
                if (this.removeFromWorld !== true) {
                    this.game.player.takeDmg(1, vectorToDir(vec));
                    this.destroy();
                }

                this.game.player.x -= vec.x;
                this.game.player.y -= vec.y;
            }
        }
    }

    destroy() {
        super.destroy();
        new LogObject(this.game, this.x, this.y, this.dir);
    }
}

class WoodChip extends Projectile {
    constructor(game, x, y, dir, owner) {
        let animation = null;
        let rand = Math.floor(Math.random() * 6);
        switch (rand) {
            case 1:
                animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/BallPulseBlue.png"),
                    STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    7, true, STANDARD_DRAW_SCALE);
                break;
            case 2:
                animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/BallPulseGreen.png"),
                    STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    7, true, STANDARD_DRAW_SCALE);
                break;
            case 3:
                animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/BallPulseRed.png"),
                    STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    7, true, STANDARD_DRAW_SCALE);
                break;
            default:
                animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Fireball.png"),
                    STANDARD_ENTITY_FRAME_WIDTH / 2, STANDARD_ENTITY_FRAME_WIDTH / 2,
                    {x: 0, y: 0}, {x: 3, y: 0},
                    7, true, STANDARD_DRAW_SCALE);
                break;
        }
        super(game, x, y, dir, 400, Infinity, false, owner, animation, 1, 5, 20);

        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.animation._scale = this.myScale;
        this.collider = new Collider(0, 0, 8, 8, 8, 8, 8, 150);

    }

    testCollision() {
        let that = this;
        this.game.entities[LAYERS.ENEMIES].forEach(function (enemy) {
            if (!(enemy instanceof WoodDragonHead || enemy instanceof WoodDragonArm || enemy instanceof WoodDragon)) {
                if (enemy.collider && checkCollision(enemy, enemy.collider, that, that.collider)) {
                    enemy.destroy();
                }
            }
        });
        this.game.entities[LAYERS.OBJECTS].forEach(function (object) {
            if (object instanceof Post || object instanceof PostSection) {
                if (object.collider && checkCollision(object, object.collider, that, that.collider)) {
                    that.destroy();
                }
            } else {
                if (object.collider && checkCollision(object, object.collider, that, that.collider)) {
                    object.destroy();
                }
            }
        });

        if (this.game.player && checkCollision(this, this.collider, this.game.player, this.game.player._collider)) {
            let attackedFromVector = normalizeV(dirV({x: this.x, y: this.y}, {
                x: this.game.player.x,
                y: this.game.player.y
            }));
            let attackedFromDir = vectorToDir(attackedFromVector);
            this.game.player.takeDmg(1, attackedFromDir);
            that.destroy();
        }
    }
}

class Shockwave extends Projectile {
    constructor(game, x, y, owner, animation, time, startScale, endScale) {
        super(game, x, y, {x: 0, y: 0}, 0, time, true, owner, animation, 1, startScale);
        this.myAddScale = 0;
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
        this.radius = 0;

        this.collider = new Collider(0, 0, 7, 7, 7, 8, this.radius, 150);

        this.startScale = startScale;
        this.endScale = endScale;

        this.canReflect = false;

    }

    update() {
        this.myAddScale = this.startScale + (this.endScale - this.startScale) * this.timer.getPercent();
        this.collider._radius = this.myAddScale * 55;
        console.log(this.myAddScale);
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;

        this.testCollision();
    }
}



