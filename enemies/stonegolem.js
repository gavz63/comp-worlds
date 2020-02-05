class StoneGolem extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        let spriteSheet = game.AM.getAsset("./img/enemies/StoneGolemSheet.png");
        this.myAddScale = 2;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.moveAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 6, true, this.myScale);
        this.attackAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 4, y: 1}, 10, false, this.myScale);
        this.deathAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2}, 10, false, this.myScale);

        this.animation = this.moveAnimation;

        this.speed = 30;
        this.radius = STANDARD_ENTITY_RADIUS * 2;
        this.attackTimer = null;
        this.isAttacking = false;
        this.goalPoint = {x: 0, y: 0};
    }

    update() {
        super.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        let vectorToPlayer = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let normVector = normalizeV(vectorToPlayer);

        if (this.isAttacking) {
            if (this.animation.isDone()) {
                this.isAttacking = false;
                this.animation = this.moveAnimation;
                this.animation.resetAnimation();
            }
        } else {
            this.animation = this.moveAnimation;
            this.x += normVector.x * this.speed * this.game._clockTick;
            this.y += normVector.y * this.speed * this.game._clockTick;
            if (lengthV(vectorToPlayer) < 120) {
                if(!this.isCharging) {
                    this.charge()
                } else {

                }
            } else {
                this.isCharging = false;
            }
        }
    }

    charge() {

    }

    attack() {
        this.isAttacking = true;
        this.animation = this.attackAnimation;
        this.animation.resetAnimation();
    }

    destroy() {
        super.destroy();
        new Remnant(this.game, this.x, this.y, this.deathAnimation);
    }
}