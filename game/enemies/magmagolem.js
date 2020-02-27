class MagmaGolem extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        let spriteSheet = game.AM.getAsset("./img/enemies/MagmaGolemSheet.png");
        this.myAddScale = 10;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.moveAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 6, true, this.myScale);
        this.attackAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 0}, {x: 3, y: 1}, 8, false, this.myScale);
        this.deathAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 4, y: 1}, {x: 2, y: 2}, 10, false, this.myScale);
        this.chargeAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 3, y: 2}, {x: 1, y: 3}, 8, true, this.myScale);

        this.animation = this.moveAnimation;

        this.speed = 20;
        this.collider = new Collider(0, 0, -28, 28, -30, 30, null, 150); // 12,12,14,14
        this.radius = STANDARD_ENTITY_RADIUS * 0.8 * 5;
        this.isWaiting = false;
        this.isAttacking = false;
        this.goalPoint = null;
        this.dir = null;
        this.hp = 100;
        this.wait();

        this.healthBar = new HealthBar(this.game, this.game._ctx.canvas.width/2, 100, this.game._ctx.canvas.width * 0.9, this);
    }

    update() {
        super.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        if (!this.isWaiting) {
            if (this.isAttacking) {
                if (this.animation.isDone()) {
                    this.backToNormal();
                    this.wait();
                }
            } else {
                this.pathfind(1000, 50);
                if (this.isCharging) {
                    this.go(this.dir);
                } else if (this.goalPoint) {
                    if (this.goalPoint.x === this.game.player.x && this.goalPoint.y === this.game.player.y) {
                        this.charge();
                    } else {
                        this.go(normalizeV(dirV(this, this.goalPoint)));
                    }
                }
                let newPos = {x: this.x, y: this.y};
                if (this.wallCollision(newPos)) {
                    this.x = this.oldPos.x;
                    this.y = this.oldPos.y;
                    this.attack();
                } else {
                    this.oldPos = newPos;
                }
            }
        }
    }

    charge() {
        this.goalPoint = {
            x: indexToCoordinate(coordinateToIndex(this.game.player.x)),
            y: indexToCoordinate(coordinateToIndex(this.game.player.y)),
        };
        this.dir = normalizeV(dirV(this, this.goalPoint));
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
        this.goalPoint = null;
        this.dir = null;
    }

    wait() {
        this.isWaiting = true;
        let that = this;
        new TimerCallback(this.game, 1.75, false, function () {
            that.isWaiting = false;
        })
    }
}