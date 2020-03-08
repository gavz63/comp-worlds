const PHASE = {};

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
            7, true, this.myScale);
        this.flyingLeftCollider = new Collider(0, 0,
            128 * 2, 94 * 2,
            64 * 2, 96 * 2,
            null, 150);

        this.flyingRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonFlyingRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, true, this.myScale);
        this.flyingRightCollider = new Collider(0, 0,
            128 * 2, 94 * 2,
            96 * 2, 64 * 2,
            null, 150);

        this.shadowLeftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonShadowLeftFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, true, this.myScale);

        this.shadowRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonShadowRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, true, this.myScale);

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
            32 * 2, 84 * 2,
            null, 150);

        this.bodyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonBodyRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 6, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 3, y: 0},
            7, false, this.myBodyScale);
        this.bodyRightCollider = new Collider(0, 0,
            8 * 2, 64 * 2,
            84 * 2, 32 * 2,
            null, 150);


        this.animation = this.bodyLeftAnimation;
        this.color = null;
        this.direction = DIRECTION_LEFT;
        this.collider = this.bodyLeftCollider;
        this.switchDirectionTimer = null;
        this.animation.pause();
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;
        this.head = new WoodDragonHead(this.game, this.spawner, this);
        this.hp = 180;
        this.maxHp = 180;
        this.hurt = false;
        this.healthBar = new HealthBar(this.game, 0, 100, 0.9, this, "HEART OF THE OVERGROWTH: GREAT WOOD DRAGON");
    }

    update() {
        super.update();
        let that = this;
        console.log(this.hp);
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
        this.myBodyScale[0] = STANDARD_DRAW_SCALE * this.myBodyAddScale;
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;

        if (this.isTailWhipping) {
            if (this.animation.isDone()) {
                this.isTailWhipping = false;
                this.animation.resetAnimation();
                this.animation.pause();
                //TODO create a slash projectile
            }
        }

        if ((this.game.player.x > this.x + 160 && this.direction === DIRECTION_LEFT) ||
            (this.game.player.x < this.x - 160 && this.direction === DIRECTION_RIGHT)) {

            if (!this.isTailWhipping) {
                this.tailWhip();
            }
            if (this.switchDirectionTimer === null) {
                this.switchDirectionTimer = new TimerCallback(this.game, 1, false, function () {
                    that.isTailWhipping = false;
                    that.animation.resetAnimation();
                    that.animation.pause();
                    that.groundFace(that.otherDirection());
                });
            }
        } else if (this.switchDirectionTimer !== null) {
            this.switchDirectionTimer.destroy();
            this.switchDirectionTimer = null;
        }
        this.game.entities[LAYERS.PLAYER_PROJECTILES].forEach(function (elem) {
            if (!elem.dying) {
                if (checkCollision(that, that.collider, elem, elem.collider)) {
                    if (!(elem instanceof Spin)) {
                        elem.destroy();
                    }
                    elem.done = true;
                    that.takeDamage(elem.dmg, elem.dir, elem.knockBack);
                }
            }
        });
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
                        that.animation.pause();
                        that.head = new WoodDragonHead(that.game, that.spawner, that);
                        that.direction = DIRECTION_LEFT;
                        that.switchDirectionTimer = null;
                    });
                    break;
                default:
                    console.log("INVALID DIRECTION");
                    break;
            }
            this.animation.setFrame(4);
            this.animation.unpause();
            this.head.destroy();
            this.head = null;
        } else {
            console.log("Calling groundFace() when not on the ground!");
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
                    this.head.x = this.x + this.headOffset;
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
                    this.head.x = this.x - this.headOffset;
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

    draw() {
        super.draw();
        this.animation._color = this.color;
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
        }
    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.hp <= 0) {
                this.destroy();
            } else {
                this.hp -= dmg;
                this.hurt = true;
                let that = this;
                this.color = new Color(0, 100, 50).getColor();
                if (this.hurtTimer) this.hurtTimer.destroy();
                this.hurtTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                    that.hurt = false;
                });
            }
        }
    }

    destroy() {
        super.destroy();
        this.healthBar.destroy();
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
            18 * 3, 28 * 3,
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
    }

    update() {
        super.update();
        let that = this;
        this.game.entities[LAYERS.PLAYER_PROJECTILES].forEach(function (elem) {
            if (!elem.dying) {
                if (checkCollision(that, that.collider, elem, elem.collider)) {
                    if (!(elem instanceof Spin)) {
                        elem.destroy();
                    }
                    elem.done = true;
                    that.takeDamage(elem.dmg, elem.dir, elem.knockBack);
                }
            }
        });

        this.leftArm.update();
        this.rightArm.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
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
        //super.destroy();
        this.removeFromWorld = true;
    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.dragon.hp <= 0) {
                this.dragon.destroy();
            } else {
                this.dragon.hp -= dmg * 1.5;
                this.hurt = true;
                let that = this;
                this.color = new Color(0, 100, 50).getColor();
                if (this.hurtTimer) this.hurtTimer.destroy();
                this.hurtTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                    that.hurt = false;
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
    }

    update() {
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        if (this.head === null) {
            this.destroy();
        } else {
            this.y = this.head.y + STANDARD_ENTITY_FRAME_WIDTH * 2;

            //Check collision with player projectiles
            let that = this;
            this.game.entities[LAYERS.PLAYER_PROJECTILES].forEach(function (elem) {
                if (!elem.dying) {
                    if (checkCollision(that, that.collider, elem, elem.collider)) {
                        if (!(elem instanceof Spin)) {
                            elem.destroy();
                        }
                        elem.done = true;
                        that.takeDamage(elem.dmg, elem.dir, elem.knockBack);
                    }
                }
            });
            if (this.isAttacking) {
                if (this.animation.isDone()) {
                    this.isAttacking = false;
                    this.animation.resetAnimation();
                    this.animation.pause();
                    //TODO create a slash projectile
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

    }

    takeDamage(dmg, dir, knockBack) {
        if (!this.hurt) {
            if (this.head.dragon.hp <= 0) {
                this.head.dragon.destroy();
            } else {
                this.hurt = true;
                this.head.dragon.hp -= dmg / 2; //TODO, maybe this is way too low
                let that = this;
                this.color = new Color(0, 100, 50).getColor();
                if (this.hurtTimer) this.hurtTimer.destroy();
                this.hurtTimer = new TimerCallback(this.game, 0.1, false, function () {
                    that.color = null;
                    that.hurt = false;
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
        new TimerCallback(game, 2, true, function () {
            that.attack();
        });
    }

    update() {
        super.update();
        this.x = this.head.x + STANDARD_ENTITY_FRAME_WIDTH * 3;
    }
}