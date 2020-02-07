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
            {x: 0, y: 1}, {x: 4, y: 1}, 8, false, this.myScale);
        this.deathAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2}, 10, false, this.myScale);
        this.chargeAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 3}, {x: 3, y: 3}, 8, true, this.myScale);

        this.animation = this.moveAnimation;

        this.speed = 30;
        this.radius = STANDARD_ENTITY_RADIUS * 2;
        this.isWaiting = false;
        this.isAttacking = false;
        this.goalPoint = null;
    }

    update() {
        super.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        if (!this.isWaiting) {
            let vec;
            if (this.isCharging) {
                vec = dirV({x: this.x, y: this.y}, {x: this.goalPoint.x, y: this.goalPoint.y});
            } else {
                vec = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
            }
            let normVector = normalizeV(vec);

            if (this.isAttacking) {
                if (this.animation.isDone()) {
                    this.backToNormal();
                    this.wait();
                }
            } else {
                // this.animation = this.moveAnimation;
                this.x += normVector.x * this.speed * this.game._clockTick;
                this.y += normVector.y * this.speed * this.game._clockTick;

                if (lengthV(vec) < 240) {
                    if(!this.isCharging) {
                        this.charge();
                    } else if (lengthV(vec) < 5) {
                        this.backToNormal();
                        this.attack();
                    }
                }

            }
        }
    }

    charge() {
        this.goalPoint = {x: this.game._player.x, y: this.game._player.y};

        this.speed = 200;
        this.isCharging = true;
        this.animation = this.chargeAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
    }

    attack() {
        this.isAttacking = true;
        this.animation = this.attackAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
        this.attackTimer = null;
    }

    backToNormal() {
        this.speed = 20;
        this.isCharging = false;
        this.isAttacking = false;
        this.animation = this.moveAnimation;
        this.animation.resetAnimation();
    }

    wait() {
        this.isWaiting = true;
        let that = this;
        new TimerCallback(this.game, 3, false, function() {
            that.isWaiting = false;
        })
    }

    destroy() {
        super.destroy();
        new Remnant(this.game, this.x, this.y, this.deathAnimation);
    }
}