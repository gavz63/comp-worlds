class LogObject extends DestructableObject {
    constructor(game, x, y, dir) {
        super(game, x, y);
        let animation = null;
        let collider = null;
        this.myAddScale = 2;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];

        if (dir.x > 0) {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/objects/LogObjectHorizontal.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 2, y: 0}, 1, false, this.myScale);
            collider = new Collider(0, 0,
                8 * 2, 8 * 2,
                16 * 2, 16 * 2,
                null, Infinity);
        } else {
            animation = new Animation(ASSET_MANAGER.getAsset("./img/objects/LogObjectVertical.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 2, y: 0}, 1, false, this.myScale);
            collider = new Collider(0, 0,
                16 * 2, 16 * 2,
                6 * 2, 6 * 2,
                null, Infinity);
        }
        this.radius = null;
        this.collider = collider;
        this.animation = animation;
        this.animation.pause();
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
        this.deathAnimation = new Animation(game.AM.getAsset("./img/objects/Crate.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 0}, {x: 3, y: 0}, 7, false, this.myScale);
        this.hp = 3;
    }

    update() {
        super.update();
        let that = this;
        this.game.entities[LAYERS.ENEMIES].forEach(function (enemy) {
            if (enemy.collider !== null) {
                if (checkCollision(that, that.collider, enemy, enemy.collider)) {
                    that.takeDamage(1, {x: 1, y: 0}, 0);
                }
            }
        });
        while (this.removeFromWorld !== true && this.game.player && checkCollision(this, this.collider, this.game.player, this.game.player._collider)) {
            let vec = normalizeV(dirV(this, this.game.player));
            if(Math.abs(vec.x) < 0.1)
            {
              vec.x = 0;
            }
            else if(Math.abs(vec.y) < 0.1)
            {
              vec.y = 0;
            }

            this.game.player.x += vec.x;
            this.game.player.y += vec.y;
            // while(this.game.player.wallCollision(this.game.player))
            // {
            //   if(this.removeFromWorld !== true)
            //   {
            //     this.game.player.takeDmg(1, vectorToDir(vec));
            //     this.destroy();
            //   }
            //
            //   this.game.player.x -= vec.x;
            //   this.game.player.y -= vec.y;
            // }
        }
        this.animation.setFrame(3 - this.hp);
    }

    takeDamage(dmg, dir, knockBack) {
        super.takeDamage(1, dir, knockBack);
    }
}