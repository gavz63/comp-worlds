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

        this.speed = 75;
        this.radius = STANDARD_ENTITY_RADIUS*0.5;
        this.attackTimer = null;
        this.attacked = false;

        this.hp = 3;
        
        this.projectileAnimation = new Animation(game.AM.getAsset("./img/projectiles/BoneProjectile.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);

    }

    update() {
        let skelPlayVector = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let attackVector = normalizeV(skelPlayVector);
        if (this.attackTimer) { //attacking
            if (this.animation.isDone() && this.animation === this.attackAnimation) {
                if (!this.attacked) {
                    this.attacked = true;
                    let projectile = new Projectile(this.game,
                        this.x, this.y,
                        attackVector,
                        200, 4, true,
                        this, this.projectileAnimation,
                        1, 20, 10);
                    //should transition to some idle animation here some day...
                    this.animation = this.moveAnimation;
                    this.animation.resetAnimation();
                    this.animation.unpause();
                }
            } else {
                this.attacked = false;
            }
        } else {
            this.pathfind(1000, 50);
            if (lengthV(skelPlayVector) > 200 ||
                (this.goalPoint.x === this.game.player.x &&
                    this.goalPoint === this.game.player.y)) {
                    this.animation = this.moveAnimation;
                if (this.goalPoint) {
                    this.go(normalizeV(dirV(this, this.goalPoint)));
                }
            } else {
                let that = this;
                this.attackTimer = new TimerCallback(this.game, 2, false,
                    function () {
                        that.attackTimer = null;
                        that.attack();
                    }); // Time before the enemy starts attacks
            }
        }
    }

    attack() {
        let that = this;
        this.animation = this.attackAnimation;
        this.animation.resetAnimation();
        this.attackTimer = new TimerCallback(this.game, 2, false, function () {
            that.attackTimer = null;
        }); // time enemy remains in the attack state regardless of distance
    }
}