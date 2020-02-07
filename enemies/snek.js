class Snek extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        let spriteSheet = game.AM.getAsset("./img/enemies/SnekSheet.png");

        this.moveAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            6, true, STANDARD_DRAW_SCALE);
        this.attackAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 5, y: 1},
            10, false, STANDARD_DRAW_SCALE);
        this.deathAnimation = new Animation(spriteSheet,
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 5, y: 2},
            16, false, STANDARD_DRAW_SCALE);

        this.projectileAnimation = new Animation(game.AM.getAsset("./img/projectiles/BallPulseGreen.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0},
            10, true, STANDARD_DRAW_SCALE/2);

        this.animation = this.moveAnimation;
        this.speed = 45;

        let that = this;
        this.attackTimer = new TimerCallback(this.game, 3, true, function () {
            that.attack();
        });
    }

    update() {
        super.update();

        let vec = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let normVector = normalizeV(vec);


        this.x += normVector.x * this.speed * this.game._clockTick;
        this.y += normVector.y * this.speed * this.game._clockTick;

        if (this.isAttacking) {
            if (this.animation.isDone()) {
                this.isAttacking = false;
                this.animation = this.moveAnimation;
                this.speed = 45;
                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) {
                            continue;
                        }
                        new Projectile(this.game,
                            this.x, this.y,
                            normalizeV({x: i, y: j}),
                            100, 5,
                            this,
                            this.projectileAnimation, 1, 20);
                    }
                }
            }
        }
    }

    attack() {
        this.isAttacking = true;
        this.animation = this.attackAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
        this.speed = 0;
    }
}