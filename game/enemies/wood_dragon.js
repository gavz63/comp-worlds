const PHASE = {};

class WoodDragon extends Enemy {
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

        this.flyingRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/DragonFlyingRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 4, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 5, y: 0},
            7, true, this.myScale);

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
            4, false, this.myBodyScale);

        this.bodyRightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonBodyRightFace.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 6, STANDARD_ENTITY_FRAME_WIDTH * 4,
            {x: 0, y: 0}, {x: 3, y: 0},
            4, false, this.myBodyScale);

        this.animation = this.bodyRightAnimation;
        this.direction = DIRECTION_RIGHT;
        this.switchDirectionTimer = null;
        this.animation.pause();
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;
        this.head = new WoodDragonHead(this.game, this.spawner, this);
    }

    update() {
        super.update();
        let that = this;
        if (this.head !== null) {
            this.head.update();
        }
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
        this.myBodyScale[0] = STANDARD_DRAW_SCALE * this.myBodyAddScale;
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;

        if ((this.game.player.x > this.x && this.direction === DIRECTION_LEFT) ||
            (this.game.player.x < this.x && this.direction === DIRECTION_RIGHT)) {

            if (this.switchDirectionTimer === null) {
                this.switchDirectionTimer = new TimerCallback(this.game, 1, false, function () {
                    that.groundFace(that.otherDirection());
                    console.log("callback");
                });
                console.log("Created timer");
            }
        } else if (this.switchDirectionTimer !== null) {
            this.switchDirectionTimer.destroy();
            this.switchDirectionTimer = null;
        }
    }

    groundFace(dir) {
        if (this.animation === this.bodyRightAnimation ||
        this.animation === this.bodyLeftAnimation) {
            let that = this;
            switch (dir) {
                case DIRECTION_RIGHT:
                    this.animation = this.flyingRightAnimation;
                    new TimerCallback(this.game, 1, false, function() {
                        that.animation = that.bodyRightAnimation;
                        that.animation.pause();
                        that.head = new WoodDragonHead(that.game, that.spawner, that);
                        that.direction = DIRECTION_RIGHT;
                        that.switchDirectionTimer = null;
                    });
                    break;
                case DIRECTION_LEFT:
                    this.animation = this.flyingLeftAnimation;
                    new TimerCallback(this.game, 1, false, function() {
                        that.animation = that.bodyLeftAnimation;
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

    otherDirection() {
        if (this.direction === DIRECTION_RIGHT) {
            return DIRECTION_LEFT;
        } else {
            return DIRECTION_RIGHT;
        }
    }
    
    takeDamage(dmg, dir, knockBack)
    {
          console.log("Dragon");
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

        this.animation = this.stdAnimation;
        this.animation.pause();

        this.dragon = dragon;
        this.leftArm = new WoodDragonLeftArm(this.game, this.spawner, this);
        this.rightArm = new WoodDragonRightArm(this.game, this.spawner, this);
    }

    update() {
        super.update();
        this.leftArm.update();
        this.rightArm.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
    }

    draw() {
        this.rightArm.draw();
        this.leftArm.draw();
        super.draw();
    }

    destroy() {
        this.leftArm.destroy();
        this.rightArm.destroy();
        //super.destroy();
        this.removeFromWorld = true;
    }

    takeDamage(dmg, dir, knockBack)
    {
      console.log(dmg);
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
                }
            }
        }
    }

    draw() {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
    }

    attack() {
        this.isAttacking = true;
        this.animation.unpause();
    }

    destroy() {

    }

    takeDamage(dmg, dir, knockBack)
    {
      console.log("Arm");
    }
}

class WoodDragonLeftArm extends WoodDragonArm {
    constructor(game, spawner, head) {
        super(game, head.x - STANDARD_ENTITY_FRAME_WIDTH * 3, head.y + STANDARD_ENTITY_FRAME_WIDTH * 2, head);

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
    
    takeDamage(dmg, dir, knockBack)
    {
      console.log("Left Arm");
    }
}

class WoodDragonRightArm extends WoodDragonArm {
    constructor(game, spawner, head) {
        super(game, head.x + STANDARD_ENTITY_FRAME_WIDTH * 3, head.y + STANDARD_ENTITY_FRAME_WIDTH * 2, head);

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
    
    takeDamage(dmg, dir, knockBack)
    {
      console.log("Right Arm");
    }
}