class BoneMan extends Skeleton {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        this._myScale = [1.5 * STANDARD_DRAW_SCALE];

        this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/BoneManWalk.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 5, y: 0}, 10, true, this._myScale);
        this.attackAnimation = new Animation(game.AM.getAsset("./img/enemies/BoneManAttack.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, false, this._myScale);
        this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/BoneManDeath.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, false, this._myScale);

        this.animation = this.moveAnimation;
        this.animation.unpause();

        this.speed = 75;
        this.collider = new Collider(0, 0, 0, 0, 0, 0, STANDARD_ENTITY_RADIUS * 0.5, 5);
        this.isAttacking = false;

        this.hp = 3;

        this.projectileAnimation = new Animation(game.AM.getAsset("./img/projectiles/BoneProjectile.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);

    }

    update() {
        this._myScale[0] = 1.5 * STANDARD_DRAW_SCALE;
        let vecToPlayer = dirV(this, this.game._player);
        let attackVector = normalizeV(vecToPlayer);

        if (this.isAttacking) {
            if (this.animation.isDone()) {

                new Projectile(this.game,
                    this.x, this.y,
                    attackVector,
                    200, 1.25, true, this,
                    this.projectileAnimation,
                    1, 2);

                this.animation.resetAnimation();
                this.animation.unpause();
            }
        } else if (!this.waitTimer && lengthV(vecToPlayer) < 300) {
            this.attack();
        }
    }
}