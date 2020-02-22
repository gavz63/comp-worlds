class Skeleton extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        this._myScale = [2 * STANDARD_DRAW_SCALE];
        
        this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonWalk.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0}, 10, true, this._myScale);
        this.attackAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonAttack.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, false, this._myScale);
        this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/SkeletonDeath.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, false, this._myScale);

        this.animation = this.moveAnimation;
        this.animation.unpause();

        this.speed = 75;
        this.radius = STANDARD_ENTITY_RADIUS*0.5;
        this.isAttacking = false;

        this.hp = 3;
        
        this.projectileAnimation = new Animation(game.AM.getAsset("./img/projectiles/BoneProjectile.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);

    }

    update() {
        let skelPlayVector = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let attackVector = normalizeV(skelPlayVector);

        if (this.isAttacking) {
            if (this.animation.isDone()) {
                this.animation.resetAnimation();
                this.animation.unpause();
                //this.isAttacking = false;
                new Projectile(this.game,
                    this.x, this.y,
                    attackVector,
                    200, 4, true,
                    this, this.projectileAnimation,
                    1, 20, 10);
                // this.animation = this.moveAnimation;
                // this.animation.unpause();
            }
        } else {
            this.pathfind(1000, 50);
            if (lengthV(skelPlayVector) > 150 ||
                (this.goalPoint.x === this.game.player.x &&
                    this.goalPoint === this.game.player.y)) {

                if (this.aboutToAttackTimer) {
                    this.aboutToAttackTimer.destroy();
                    this.aboutToAttackTimer = null;
                }
                if (this.goalPoint) {
                    this.go(normalizeV(dirV(this, this.goalPoint)));
                }
            } else {
                let that = this;
                this.aboutToAttackTimer = new TimerCallback(this.game, 2.5, false, function () {
                        that.attack();
                    });
            }
        }
    }

    attack() {
        this.aboutToAttack = false;
        this.animation = this.attackAnimation;
        this.animation.resetAnimation();
        this.isAttacking = true;
        this.animation.unpause();
        let that = this;

        //Attack repeatedly until this calls back
        new TimerCallback(this.game, 1.5, false, function () {
            that.isAttacking = false;
            that.animation = that.moveAnimation;
            that.animation.unpause();
        });
    }
}