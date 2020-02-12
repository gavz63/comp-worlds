class HedgeMonster extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);

        this.wakeAnimation = new Animation(game.AM.getAsset("./img/enemies/HedgeMonster.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            4, false, STANDARD_DRAW_SCALE);

        this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/HedgeMonsterToSleep.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            4, false, STANDARD_DRAW_SCALE);

        this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/HedgeMove.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 3, y: 0},
            4, true, STANDARD_DRAW_SCALE);

        this.animation = this.wakeAnimation;
        this.animation.pause();

        this.home = {x: spawner.x, y: spawner.y};

        this.radius = STANDARD_ENTITY_RADIUS;
        this.isWaking = false;
        this.isAwake = false;
        this.isGoingHome = false;
        this.speed = 100;
    }

    update() {
        super.update();

        let vecToHome = dirV({x: this.x, y: this.y}, {x: this.home.x, y: this.home.y});

        if (this.game.player) {
            let vecToPlayer = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});

            if (this.isAwake) {
                let vecToPlayer = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});

                if (lengthV(vecToPlayer) > lengthV(vecToHome) && (lengthV(vecToHome) > 200 || this.isGoingHome)) {
                    this.goHome();
                } else {
                    this.pursue();
                }
            } else if (this.isWaking) {
                if (this.animation.isDone()) {
                    this.isWaking = false;
                    this.isAwake = true;
                    this.animation = this.moveAnimation;
                }
            } else if (lengthV(vecToPlayer) < 64) {
                this.wakeUp();
            }
        } else if (lengthV(vecToHome) > 5) {
            this.goHome();
        }
    }

    wakeUp() {
        this.isWaking = true;
        this.animation = this.wakeAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
    }

    pursue() {
        this.isGoingHome = false;
        this.animation = this.moveAnimation;
        this.animation.unpause();
        let vecToPlayer = dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y});
        let normVecToPlayer = normalizeV(vecToPlayer);

        this.x += normVecToPlayer.x * this.game._clockTick * this.speed;
        this.y += normVecToPlayer.y * this.game._clockTick * this.speed;
    }

    goHome() {
        this.isGoingHome = true;
        let vecToHome = dirV({x: this.x, y: this.y}, {x: this.home.x, y: this.home.y});
        let normVecToHome = normalizeV(vecToHome);

        if (lengthV(vecToHome) < 5) {
            this.goToSleep();
        } else {
            this.x += normVecToHome.x * this.game._clockTick * this.speed;
            this.y += normVecToHome.y * this.game._clockTick * this.speed;
        }
    }

    goToSleep() {
        this.animation = this.wakeAnimation;
        this.animation.resetAnimation();
        this.animation.pause();
    }
}