const MODE = {
    BULLET_HELL: "bullet hell", // Keep behind pits and shoot logs and posts
    AGGRESSIVE: "aggro", // Up close to player working claw/head/tail machine
    REST: "break", // Behind middle pit, spawn enemies and heal self
    SCREEN_WIPE: "armegeddon", // Behind middle pit blow wood chipper blast
    WAKE_UP: "awaken", // This only happens once at the very beginning of the fight
    TRANSITION: "transition"
};

/* based on health. There are 3 phases that get progressively harder */
const PHASE = {
    EASY: {
        modeSet: [MODE.BULLET_HELL, MODE.AGGRESSIVE, MODE.BULLET_HELL, MODE.SCREEN_WIPE, MODE.BULLET_HELL, MODE.SCREEN_WIPE, MODE.AGGRESSIVE],
        timePerMode: 15
    },
    MEDIUM: {
        modeSet: [MODE.REST, MODE.AGGRESSIVE, MODE.BULLET_HELL, MODE.SCREEN_WIPE, MODE.BULLET_HELL, MODE.SCREEN_WIPE],
        timePerMode: 10
    },
    HARD: {
        modeSet: [MODE.REST, MODE.SCREEN_WIPE, MODE.AGGRESSIVE, MODE.SCREEN_WIPE, MODE.BULLET_HELL, MODE.BULLET_HELL, MODE.AGGRESSIVE],
        timePerMode: 5
    }
};

/**
 * This class is the body of the dragon when it is
 * on the ground. It is the whole dragon when it is flying.
 *
 * @author Gavin Montes
 * */
class WoodDragon extends Enemy {
    /**
     * @inheritDoc
     */
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        this.myAddScale = 3;
        this.myBodyAddScale = 2;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.myBodyScale = [STANDARD_DRAW_SCALE * this.myBodyAddScale];

        this.flyingLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonFlyingLeftFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            10, true, this.myScale);
        this.flyingLeftCollider = new Collider(0, 0,
            128 * 2, 94 * 2,
            64 * 2, 96 * 2,
            null, 150);

        this.flyingRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonFlyingRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            10, true, this.myScale);
        this.flyingRightCollider = new Collider(0, 0,
            128 * 2, 94 * 2,
            96 * 2, 64 * 2,
            null, 150);

        this.shadowLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonShadowLeftFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            10, true, this.myBodyScale);

        this.shadowRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonShadowRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            10, true, this.myBodyScale);

        this.takingOffLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonTakingOffLeftFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 7, y: 0},
            7, false, this.myScale);

        this.takingOffRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonTakingOffRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 7, y: 0},
            7, false, this.myScale);

        this.bodyLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonBodyLeftFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 6, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 3, y: 0},
            7, false, this.myBodyScale);
        this.bodyLeftCollider = new Collider(0, 0,
            8 * 2, 64 * 2,
            32 * 2, 13 * 2,
            null, 150);

        this.bodyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonBodyRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 6, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 3, y: 0},
            7, false, this.myBodyScale);
        this.bodyRightCollider = new Collider(0, 0,
            8 * 2, 64 * 2,
            13 * 2, 32 * 2,
            null, 150);


        this.animation = this.bodyLeftAnimation;
        this.color = null;
        this.direction = DIRECTION_LEFT;
        this.collider = this.bodyLeftCollider;
        this.switchDirectionTimer = null;
        this.animation.pause();
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;
        this.head = new WoodDragonHead(this.game, this.spawner, this);
        this.maxHp = 180;
        this.hp = this.maxHp;
        this.hurt = false;
        this.healthBar = new HealthBar(this.game, 0, 100, 0.9, this, "HEART OF THE OVERGROWTH: GREAT WOOD DRAGON");

        let that = this;
        this.wakeTimer = new TimerCallback(this.game, 3, false, function () {
            /* This stuff deals with switching phases and modes. */
            that.phase = PHASE.EASY;
            that.modeSetIndex = 0;
            that.mode = MODE.TRANSITION;
            that.modeTimer = new TimerCallback(game, that.phase.timePerMode, true, function () {
                that.changeMode();
            });
        });

        this.hasTakenOff = false;
        this.isTakingOff = false;
        this.isLanding = false;
        this.hasBreathed = false;
        this.restProc = false;

        this.hoverTimer = null;
        this.hoverTimer = null;
        this.landingTimer = null;
        this.woodChipTimer = null;
        this.screenWipeTimer = null;
    }

    changeMode() {
        this.modeSetIndex += 1;
        if (this.modeSetIndex === this.phase.modeSet.length) {
            this.modeSetIndex = 0;
        }
        this.isTailWhipping = false;
        this.mode = MODE.TRANSITION;
    }

    killTimers() {
        if (this.hurtTimer) this.hurtTimer.destroy();
        if (this.colorTimer) {
            this.colorTimer.destroy();
            this.color = null;
        }
        if (this.modeTimer) this.modeTimer.destroy();
        if (this.woodChipTimer) this.woodChipTimer.destroy();
        if (this.hoverTimer) this.hoverTimer.destroy();
        if (this.landingTimer) this.landingTimer.destroy();
        if (this.switchDirectionTimer) this.switchDirectionTimer.destroy();
        if (this.screenWipeTimer) this.screenWipeTimer.destroy();
    }

    createScreenWipeTimer() {
        let that = this;
        if (this.screenWipeTimer !== null) {
            this.screenWipeTimer.destroy();
            this.screenWipeTimer = null;
        }
        this.screenWipeTimer = new TimerCallback(this.game, 6, false, function () {
            that.screenWipeTimer = null;
            that.modeTimer.unpause();
            that.changeMode();
            that.game.entities[LAYERS.OBJECTS].forEach(function (object) {
                if (object instanceof Post) {
                    object.destroy();
                }
            });
            that.game.entities[LAYERS.ENEMY_PROJECTILES].forEach(function (p) {
                if (p instanceof WoodChip) {
                    p.destroy();
                }
            });
            if (that.woodChipTimer !== null) {
                that.woodChipTimer.destroy();
                that.woodChipTimer = null;
            }
        });
    }

    update() {
        super.update();
        let that = this;
        if (this.phase === PHASE.EASY && this.hp < this.maxHp * (2 / 3)) {
            this.killTimers();
            this.mode = MODE.TRANSITION;
            this.phase = PHASE.MEDIUM;
            this.modeSetIndex = 0;
            this.modeTimer = new TimerCallback(this.game, this.phase.timePerMode, true, function () {
                that.changeMode();
            });
        } else if (this.phase === PHASE.MEDIUM && this.hp < this.maxHp * (1 / 3)) {
            this.killTimers();
            this.mode = MODE.TRANSITION;
            this.phase = PHASE.HARD;
            this.modeSetIndex = 0;
            this.modeTimer = new TimerCallback(this.game, this.phase.timePerMode, true, function () {
                that.changeMode();
            });
        }
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
        this.myBodyScale[0] = STANDARD_DRAW_SCALE * this.myBodyAddScale;
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;

        switch (this.mode) {
            case MODE.AGGRESSIVE:
                this.doGroundMode();
                break;
            case MODE.BULLET_HELL:
                this.doBulletHell();
                break;
            case MODE.SCREEN_WIPE:
                if (!this.modeTimer.paused) {
                    this.modeTimer.pause();

                    this.createScreenWipeTimer();
                }
                this.doScreenWipe();
                break;
            case MODE.REST:
                if (!this.restProc) {
                    let enemies = [Skeleton.prototype, Snek.prototype, Snak.prototype,
                        CactusBoi.prototype, StoneGolem.prototype, Bat.prototype];
                    for (let i = 0; i < 10; i += 2) {
                        let rand = Math.floor(Math.random() * enemies.length);
                        new enemies[rand].constructor(this.game, indexToCoordinate(i + 3), indexToCoordinate(4));
                    }
                    this.restProc = true;
                    this.phase.modeSet.shift();
                }
                if (this.phase === PHASE.MEDIUM && this.hp < (this.maxHp * (2 / 3)) - 2) {
                    this.hp += 0.01;
                } else if (this.hp < (this.maxHp * (1 / 3)) - 2) {
                    this.hp += 0.02;
                }

                break;
            case MODE.TRANSITION:
                this.doTransition();
                break;
            default:
                break;
        }
    }

    doScreenWipe() {
        if (!this.hasBreathed) {
            this.head.animation = this.head.breathAnimation;
            this.head.animation.resetAnimation();
            this.head.animation.unpause();
            this.hasBreathed = true;
        } else {
            if (this.head.animation.isDone()) {
                this.head.animation.setFrame(this.head.animation.getLastFrameAsInt());
                this.head.animation.pause();
            }
            let that = this;
            if (this.woodChipTimer === null) {
                this.woodChipTimer = new TimerCallback(this.game, 0.05, true, function () {
                    let rotate = 180 / 50;
                    for (let i = 0; i < 50; i++) {
                        new WoodChip(that.game,
                            that.head.x, that.head.y + 75,
                            (i * rotate),
                            that.head);
                    }
                });
            }
        }
    }

    doTransition() {
        this.restProc = false;
        if (this.head !== null) {
            this.head.destroy();
            this.head = null;
        }
        this.modeTimer.pause();
        if (this.woodChipTimer) {
            this.woodChipTimer.destroy();
            this.woodChipTimer = null;
        }

        if (!this.hasTakenOff || this.isTakingOff) {
            this.doTakeOff();
        } else {
            if (this.goalPoint === null) {
                switch (this.phase.modeSet[this.modeSetIndex]) { // The mode we are transitioning to
                    case MODE.AGGRESSIVE:
                        this.goalPoint = this.game.player;
                        let that = this;
                        this.landingTimer = new TimerCallback(this.game, 5, false, function () {
                            that.doLanding();
                        });
                        break;
                    default:
                        this.goalPoint = {x: indexToCoordinate(8), y: indexToCoordinate(1.3)};
                        break;
                }
            }
            if (this.goalPoint.x > this.x) {
                this.setFacing(DIRECTION_RIGHT);
            } else if (this.goalPoint.x < this.x) {
                this.setFacing(DIRECTION_LEFT);
            }
            this.go(normalizeV(dirV(this, this.goalPoint)));
            if ((this.x > this.goalPoint.x - 5 && this.x < this.goalPoint.x + 5 &&
                this.y > this.goalPoint.y - 5 && this.y < this.goalPoint.y + 5) ||
                this.isLanding) {
                this.doLanding();
            }
        }
    }

    doLanding() {
        if (this.landingTimer) this.landingTimer.destroy();
        this.landingTimer = null;
        this.mode = this.phase.modeSet[this.modeSetIndex];
        this.hasTakenOff = false;
        this.isTakingOff = false;
        this.isLanding = true;

        switch (this.mode) { // The mode we are transitioning to
            case MODE.AGGRESSIVE:
                let that = this;
                if (this.hoverTimer === null) {
                    this.hoverTimer = new TimerCallback(this.game, 2, false, function () {
                        that.modeTimer.reset();
                        that.modeTimer.unpause();
                        that.hoverTimer = null;
                        if (that.direction === DIRECTION_LEFT) {
                            that.animation = that.bodyLeftAnimation;
                            that.collider = that.bodyLeftCollider;
                        } else {
                            that.animation = that.bodyRightAnimation;
                            that.collider = that.bodyRightCollider;

                        }
                        that.animation.resetAnimation();
                        that.animation.pause();
                        if (that.head !== null) {
                            that.head.destroy();
                            that.head = null;
                        }
                        that.head = new WoodDragonHead(that.game, that.spawner, that);

                        that.isLanding = false;
                        that.goalPoint = null;
                    });
                }
                break;
            default:
                this.x = this.goalPoint.x;
                this.y = this.goalPoint.y;
                this.goalPoint = null;
                this.isLanding = false;
                if (this.direction === DIRECTION_LEFT) {
                    this.animation = this.bodyLeftAnimation;
                    this.collider = this.bodyLeftCollider;
                } else {
                    this.animation = this.bodyRightAnimation;
                    this.collider = this.bodyRightCollider;
                }
                this.animation.resetAnimation();
                this.animation.pause();
                if (this.head !== null) {
                    this.head.destroy();
                    this.head = null;
                }
                this.head = new WoodDragonHead(this.game, this.spawner, this);
                this.modeTimer.reset();
                this.modeTimer.unpause();
                break;
        }
    }

    doTakeOff() {
        if (this.hasTakenOff) { // If we have started taking off
            this.animation.unpause();
            if (this.isTakingOff && this.animation.isDone()) { //Check if we are done taking off
                this.isTakingOff = false;
                switch (this.phase.modeSet[this.modeSetIndex]) {
                    case MODE.REST:
                    case MODE.AGGRESSIVE:
                        if (this.direction === DIRECTION_RIGHT) {
                            this.animation = this.shadowRightAnimation;
                        } else {
                            this.animation = this.shadowLeftAnimation;
                        }
                        this.collider = null;
                        break;
                    default:
                        if (this.direction === DIRECTION_RIGHT) {
                            this.animation = this.flyingRightAnimation;
                        } else {
                            this.animation = this.flyingLeftAnimation;
                        }
                        break;
                }
                this.animation.resetAnimation();
            }
        } else { //Start taking off
            if (this.hoverTimer) {
                this.hoverTimer.destroy();
                this.hoverTimer = null;
            }
            if (this.direction === DIRECTION_RIGHT) {
                this.animation = this.takingOffRightAnimation;
                this.collider = this.flyingRightCollider;
            } else {
                this.animation = this.takingOffLeftAnimation;
                this.collider = this.flyingLeftCollider;
            }
            if (this.head) this.head.destroy();
            this.head = null;
            this.animation.resetAnimation();
            this.animation.unpause();
            this.hasTakenOff = true;
            this.isTakingOff = true;
        }
    }

    doBulletHell() {
        if (!this.head.isPostLaunching) {
            this.head.postLaunch();
        }
        if (!this.isTailWhipping) {
            this.tailWhip();
        } else {
            if (this.animation.isDone()) {
                this.isTailWhipping = false;
                this.animation.resetAnimation();
                this.animation.pause();
                new LogProjectile(this.game, this.x, this.y, vector(0, 1), this);
            }
        }

        if (this.direction === DIRECTION_RIGHT) {
            this.goalPoint = {x: indexToCoordinate(10.5), y: indexToCoordinate(1.3)};
            if (this.x > this.goalPoint.x) {
                this.setFacing(DIRECTION_LEFT);
            }
        } else {
            this.goalPoint = {x: indexToCoordinate(4.5), y: indexToCoordinate(1.3)};
            if (this.x < this.goalPoint.x) {
                this.setFacing(DIRECTION_RIGHT);
            }
        }
        this.go(normalizeV(dirV(this, this.goalPoint)));
        this.goalPoint = null;
    }

    doGroundMode() {
        if ((this.game.player.x > this.x + 50 && this.direction === DIRECTION_LEFT) ||
            (this.game.player.x < this.x - 50 && this.direction === DIRECTION_RIGHT)) {

            if (!this.isTailWhipping) { //TODO only tail whip when player is in range of tail
                this.tailWhip();
            } else {
                if (this.animation.isDone()) {
                    this.isTailWhipping = false;
                    this.animation.resetAnimation();
                    this.animation.pause();
                    if (this.direction === DIRECTION_LEFT) {
                        new Projectile(this.game, this.x + 300, this.y, {x:1, y:0}, 100, 0.25,
                            false, this, new Animation(ASSET_MANAGER.getAsset("./img/projectiles/PureSlash.png"),
                                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                                {x: 0, y: 1}, {x: 3, y: 1},
                                30, false, STANDARD_DRAW_SCALE, 10), 1, 120, 100);
                    } else {
                        new Projectile(this.game, this.x - 350, this.y + 20, {x:0, y:1}, 100, 0.25,
                            false, this, new Animation(ASSET_MANAGER.getAsset("./img/projectiles/PureSlash.png"),
                                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                                {x: 0, y: 0}, {x: 3, y: 0},
                                30, false, STANDARD_DRAW_SCALE, 10), 1, 120, 100);
                    }
                }
            }
            if (this.switchDirectionTimer === null) {
                let that = this;
                this.switchDirectionTimer = new TimerCallback(this.game, 1, false, function () {
                    that.isTailWhipping = false;
                    that.animation.resetAnimation();
                    that.animation.pause();
                    that.groundFace(that.otherDirection());
                });
            }
        } else {
            if (this.switchDirectionTimer !== null) {
                this.switchDirectionTimer.destroy();
                this.switchDirectionTimer = null;
            }
            if (this.head !== null && lengthV(dirV(this.head, this.game.player)) > 245) {
                this.go(normalizeV(dirV(this, this.game.player)));
            }
        }
        if (this.head !== null && !this.head.isBiting) {
            if (this.game.player && lengthV(dirV(this.game.player, this.head)) < 150) {
                this.head.bite();
            }
        }
        if (this.animation.isDone()) {
            this.animation.resetAnimation();
            this.animation.pause();
        }
    }

    /**
     * Switch direction when dragon is on the ground.
     * @param dir DIRECTION_LEFT or DIRECTION_RIGHT. In on the ground mode there are on only 2 directions.
     */
    groundFace(dir) {
        if (this.animation === this.bodyRightAnimation ||
            this.animation === this.bodyLeftAnimation) {
            let that = this;
            switch (dir) {
                case DIRECTION_RIGHT:
                    this.animation = this.flyingRightAnimation;
                    this.collider = this.flyingRightCollider;
                    new TimerCallback(this.game, 1, false, function () {
                        that.animation = that.bodyRightAnimation;
                        that.collider = that.bodyRightCollider;
                        that.animation.resetAnimation();
                        that.animation.pause();
                        that.head = new WoodDragonHead(that.game, that.spawner, that);
                        that.direction = DIRECTION_RIGHT;
                        that.switchDirectionTimer = null;
                    });
                    break;
                case DIRECTION_LEFT:
                    this.animation = this.flyingLeftAnimation;
                    this.collider = this.flyingLeftCollider;
                    new TimerCallback(this.game, 1, false, function () {
                        that.animation = that.bodyLeftAnimation;
                        that.collider = that.bodyLeftCollider;
                        that.animation.resetAnimation();
                        that.animation.pause();
                        that.head = new WoodDragonHead(that.game, that.spawner, that);
                        that.direction = DIRECTION_LEFT;
                        that.switchDirectionTimer = null;
                    });
                    break;
                default:
                    //console.log("INVALID DIRECTION");
                    break;
            }
            this.animation.setFrame(4);
            this.animation.unpause();
            if (this.head !== null) {
                this.head.destroy();
                this.head = null;
            }
        } else {
            //console.log("Calling groundFace() when not on the ground!");
        }
    }

    /**
     * Switches the direction of the dragon's animation.
     * Pass DIRECTION_LEFT or DIRECTION_RIGHT
     * @param direction
     */
    setFacing(direction) {
        let frame = this.animation.getFrame();
        let paused = this.animation._paused;
        if (direction === DIRECTION_RIGHT) {
            this.direction = DIRECTION_RIGHT;
            switch (this.animation) {
                case this.bodyLeftAnimation:
                    this.animation = this.bodyRightAnimation;
                    this.x -= indexToCoordinate(1);
                    break;
                case this.shadowLeftAnimation:
                    this.animation = this.shadowRightAnimation;
                    break;
                case this.flyingLeftAnimation:
                    this.animation = this.flyingRightAnimation;
                    break;
                case this.takingOffLeftAnimation:
                    this.animation = this.takingOffRightAnimation;
                    break;
                default:
                    break;
            }
        } else {
            this.direction = DIRECTION_LEFT;
            switch (this.animation) {
                case this.bodyRightAnimation:
                    this.animation = this.bodyLeftAnimation;
                    this.x += indexToCoordinate(1);
                    break;
                case this.shadowRightAnimation:
                    this.animation = this.shadowLeftAnimation;
                    break;
                case this.flyingRightAnimation:
                    this.animation = this.flyingLeftAnimation;
                    break;
                case this.takingOffRightAnimation:
                    this.animation = this.takingOffLeftAnimation;
                    break;
                default:
                    break;
            }
        }
        this.animation.setFrame(frame);
        this.animation._paused = paused;
    }

    otherDirection() {
        if (this.direction === DIRECTION_RIGHT) {
            return DIRECTION_LEFT;
        } else {
            return DIRECTION_RIGHT;
        }
    }

    tailWhip() {
        if (this.animation === this.bodyLeftAnimation ||
            this.animation === this.bodyRightAnimation) {

            this.isTailWhipping = true;
            this.animation.unpause();
        } else {
            //console.log("Calling tail whip while not on ground!");
        }
    }

    draw() {
        super.draw();
        this.animation._color = this.color;
    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.hp <= 0) {
                //console.log("boop");
                this.destroy();
            } else {
                this.hp -= dmg;
                this.hurt = true;
                let that = this;
                this.hurtTimer = new TimerCallback(this.game, 0.01, false, function () {
                    that.hurt = false;
                });
                this.color = new Color(0, 100, 50).getColor();
                if (this.colorTimer) this.colorTimer.destroy();
                this.colorTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                });
            }
        }
    }

    destroy() {
        if (this.removeFromWorld === false) {
            //super.destroy();
            this.removeFromWorld = true;
            this.healthBar.destroy();
            this.killTimers();

            this.game.sceneManager.endGame();

            this.game._entities[LAYERS.ENEMIES].length = 0;
            this.game._entities[LAYERS.ENEMY_PROJECTILES].length = 0;
            this.game._entities[LAYERS.OBJECTS].length = 0;
        }
    }
}

class WoodDragonHead extends Enemy {
    constructor(game, spawner, dragon) {
        if (dragon.animation === dragon.bodyLeftAnimation) {
            super(game, dragon.x - dragon.headOffset, dragon.y, spawner);
        } else {
            super(game, dragon.x + dragon.headOffset, dragon.y, spawner);
        }
        this.myScale = dragon.myScale;
        this.myAddScale = dragon.myAddScale;
        this.collider = new Collider(0, 0,
            18 * 3, 30 * 3,
            16 * 3, 18 * 3,
            null, 150);


        this.stdAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHead.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 0, y: 0},
            4, false, this.myScale);

        this.breathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadBreathWeapon.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.biteAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadBite.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.postLaunchAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadPostLaunch.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.dmgAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadStunned.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 2, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 3, y: 0},
            4, false, this.myScale);

        this.color = null;
        this.hurt = false;
        this.animation = this.stdAnimation;
        this.animation.pause();

        this.dragon = dragon;
        this.leftArm = new WoodDragonLeftArm(this.game, this.spawner, this);
        this.rightArm = new WoodDragonRightArm(this.game, this.spawner, this);
        this.game.addEntity(this.leftArm, LAYERS.ENEMIES);
        this.game.addEntity(this.rightArm, LAYERS.ENEMIES);

        this.isPostLaunching = false;
        this.postLaunchTimer = null;
        this.postLaunchWaiting = false;
        this.isBiting = false;
    }

    update() {
        super.update();
        if (this.dragon.animation === this.dragon.bodyLeftAnimation) {
            this.x = this.dragon.x - this.dragon.headOffset;
        } else {
            this.x = this.dragon.x + this.dragon.headOffset;
        }
        this.y = this.dragon.y;

        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        if (this.isPostLaunching && this.animation.isDone() && !this.postLaunchWaiting) {
            this.animation.setFrame(this.animation.getLastFrameAsInt());
            this.animation.pause();
            this.postLaunchWaiting = true;
            if (!this.game.player.removeFromWorld) {
                let enemy_crosshair = new EnemyCrosshair(this.game, this.game.player.x, this.game.player.y, this, true);
                new TimerCallback(this.game, 2, false, function () {
                    enemy_crosshair.destroy();
                    new Post(that.game, enemy_crosshair.x, enemy_crosshair.y, true);
                })
            }
            let that = this;
            this.postLaunchTimer = new TimerCallback(this.game, 0.75, false, function () {
                that.animation = that.stdAnimation;
                that.animation.pause();
                that.postLaunchTimer = null;
                that.isPostLaunching = false;
                that.postLaunchWaiting = false;
            });
        } else if (this.isBiting) {
            if (this.animation.isDone()) {
                this.animation = this.stdAnimation;
                this.animation.pause();
                this.isBiting = false;
            }
        }
    }

    postLaunch() {
        this.animation = this.postLaunchAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
        this.isPostLaunching = true;
        this.isBiting = false;
    }

    bite() {
        this.animation = this.biteAnimation;
        this.animation.resetAnimation();
        this.animation.unpause();
        this.isPostLaunching = false;
        this.isBiting = true;

        let projectile = new Projectile(this.game, this.x, this.x, {x: 0, y: 1}, 50,
            1, false, this,
            new Animation(ASSET_MANAGER.getAsset("./img/projectiles/Bite.png"),
                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
                {x: 0, y: 0}, {x: 10, y: 0}, 10, false, this.myScale, 3),
            1, null);
        projectile.collider = new Collider(0, 0, 10, 10, 10, 10, null, 5);
        projectile.attachTo(this);
    }

    draw() {
        this.rightArm.draw();
        this.leftArm.draw();
        super.draw();
        this.animation._color = this.color;
    }

    destroy() {
        this.leftArm.destroy();
        this.rightArm.destroy();

        if (this.hurtTimer) this.hurtTimer.destroy();
        if (this.colorTimer) this.colorTimer.destroy();
        if (this.postLaunchTimer) this.postLaunchTimer.destroy();

        //super.destroy();
        this.removeFromWorld = true;

        //console.log("Head DESTROY");
    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.dragon.hp <= 0) {
                this.dragon.destroy();
            } else {
                this.dragon.hp -= dmg * 1.5;
                this.hurt = true;
                let that = this;
                this.hurtTimer = new TimerCallback(this.game, 0.01, false, function () {
                    that.hurt = false;
                });
                this.color = new Color(0, 100, 50).getColor();
                if (this.colorTimer) this.colorTimer.destroy();
                this.colorTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                });
            }
        }
    }
}

class WoodDragonArm {
    constructor(game, x, y, head) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.myAddScale = 2;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];
        this.head = head;
        this.animation = null;
        this.isAttacking = false;
        this.color = null;
        this.hurt = false;
        this.radius = null;
        this.dontDraw = true;
    }

    update() {
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        if (this.head === null) {
            this.destroy();
        } else {
            this.y = this.head.y + STANDARD_ENTITY_FRAME_WIDTH * 2;

            if (this.isAttacking) {
                if (this.animation.isDone()) {
                    this.isAttacking = false;
                    this.animation.resetAnimation();
                    this.animation.pause();
                    //TODO create a slash projectile
                    if (this.game.player) {
                        let p = new Projectile(this.game,
                            this.x, this.y,
                            normalizeV(dirV(this, this.game.player)),
                            100, 2, true, this,
                            new Animation(ASSET_MANAGER.getAsset("./img/projectiles/ClawSlash.png"),
                                STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
                                {x: 0, y: 0}, {x: 1, y: 0}, 7, true, this.myScale, 3),
                            1, null, 10);
                        p.collider = new Collider(0, 0, 16 * 3, 16 * 3, 9 * 3, 9 * 3, null, 15);

                    }
                }
            } else {
                if (this.game.player && lengthV(dirV(this.game.player, this)) < 200) {
                    this.attack();
                }
            }
        }
    }

    draw() {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
        this.animation._color = this.color;
    }

    attack() {
        this.isAttacking = true;
        this.animation.unpause();
    }

    destroy() {
        this.removeFromWorld = true;

        if (this.hurtTimer) this.hurtTimer.destroy();
        if (this.colorTimer) this.colorTimer.destroy();
    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.head.dragon.hp <= 0) {
                this.head.dragon.destroy();
            } else {
                this.hurt = true;
                this.head.dragon.hp -= dmg / 4; //TODO, maybe this is way too low

                let that = this;
                this.hurtTimer = new TimerCallback(this.game, 0.01, false, function () {
                    that.hurt = false;
                });
                this.color = new Color(0, 100, 50).getColor();
                if (this.colorTimer) this.colorTimer.destroy();
                this.colorTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                });
            }
        }
    }
}

class WoodDragonLeftArm extends WoodDragonArm {
    constructor(game, spawner, head) {
        super(game, head.x - STANDARD_ENTITY_FRAME_WIDTH * 3, head.y + STANDARD_ENTITY_FRAME_WIDTH * 2, head);
        this.collider = new Collider(0, 0,
            18 * 2, 32 * 2,
            16 * 2, 40 * 2,
            null, 150);
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonLeftClaw.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 3, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, false, this.myScale);
        this.animation.pause();
    }

    update() {
        super.update();
        this.x = this.head.x - STANDARD_ENTITY_FRAME_WIDTH * 3;
    }
}

class WoodDragonRightArm extends WoodDragonArm {
    constructor(game, spawner, head) {
        super(game, head.x + STANDARD_ENTITY_FRAME_WIDTH * 3, head.y + STANDARD_ENTITY_FRAME_WIDTH * 2, head);
        this.collider = new Collider(0, 0,
            18 * 2, 32 * 2,
            40 * 2, 16 * 2,
            null, 150);
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonRightClaw.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 3, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, false, this.myScale);
        this.animation.pause();
        let that = this;
    }

    update() {
        super.update();
        this.x = this.head.x + STANDARD_ENTITY_FRAME_WIDTH * 3;
    }
}