class LogObject extends DestructableObject {
    constructor(game, x, y, dir) {
        super(game, x, y);
        let animation = null;
        let collider = null;
        this.myAddScale = 2;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];

        if (dir.x > 0) {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingHorizontal.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 1, y: 0}, 4, true, this.myScale);
            collider = new Collider(0, 0,
                8 * 2, 8 * 2,
                16 * 2, 16 * 2,
                null, Infinity);
        } else {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingVertical.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 1, y: 0}, 4, true, this.myScale);
            collider = new Collider(0, 0,
                16 * 2, 16 * 2,
                8 * 2, 8 * 2,
                null, Infinity);
        }
        this.radius = null;
        this.collider = collider;
        this.animation = animation;
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
        this.deathAnimation = new Animation(game.AM.getAsset("./img/objects/Crate.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 0}, {x: 3, y: 0}, 7, false, this.myScale);
    }

    update() {
        super.update();
        let that = this;
        this.game.entities[LAYERS.ENEMIES].forEach(function(enemy) {
            if (enemy.collider !== null) {
                if (checkCollision(that, that.collider, enemy, enemy.collider)) {
                    that.takeDamage(1, {x: 1, y: 0}, 0);
                }
            }
        });
        if (checkCollision(this, this.collider, this.game.player, this.game.player.collider)) {
            let newpos = pushCollision(this, this.collider, this.game.player, this.game.player.collider).pos2;
            this.game.player.x = newpos.x;
            this.game.player.y = newpos.y;
        }
    }
}