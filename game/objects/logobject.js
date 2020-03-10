class LogObject extends DestructibleObject {
    constructor(game, x, y, dir) {
        super(game, x, y);
        let animation = null;
        let collider = null;
        if (dir.x > 0) {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingHorizontal.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 1, y: 0}, 4, true, STANDARD_DRAW_SCALE, 2);
            collider = new Collider(0, 0,
                8 * 2, 8 * 2,
                16 * 2, 16 * 2,
                null, 10);
        } else {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/projectiles/LogFlyingVertical.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 1, y: 0}, 4, true, STANDARD_DRAW_SCALE, 2);
            collider = new Collider(0, 0,
                16 * 2, 16 * 2,
                8 * 2, 8 * 2,
                null, 10);
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
}