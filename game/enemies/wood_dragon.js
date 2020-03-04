const PHASE = {

};

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
        this.animation.pause();
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;
        this.head = new WoodDragonHead(this.game, this.x + this.headOffset, this.y, this.spawner, this);
        //this.leftArm = new WoodDragonLeftArm(this.game, this.x + this.headOffset, this.y )

        let that = this;
        new TimerCallback(game, 2, true, function() {
            that.setFacing(that.otherDirection());
            console.log("heelo");
        });
    }

    update() {
        super.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
        this.myBodyScale[0] = STANDARD_DRAW_SCALE * this.myBodyAddScale;
        this.headOffset = STANDARD_ENTITY_FRAME_WIDTH * this.myBodyAddScale * 3;
    }

    draw() {
        super.draw();

        // this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true, this.addScale);
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
}

class WoodDragonHead extends Enemy {
    constructor(game, x, y, spawner, dragon) {
        super(game, x, y, spawner);

        this.myScale = dragon.myScale;
        this.myAddScale = dragon.myAddScale;


        this.stdAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHead.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x:0, y: 0}, {x: 0, y: 0},
            4, false, this.myScale);

        this.breathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadBreathWeapon.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x:0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.biteAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadBite.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x:0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.postLaunchAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadPostLaunch.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x:0, y: 0}, {x: 1, y: 0},
            4, false, this.myScale);

        this.dmgAnimation = new Animation(ASSET_MANAGER.getAsset("./img/enemies/WoodDragon/WoodDragonHeadStunned.png"),
            STANDARD_ENTITY_FRAME_WIDTH * 2, STANDARD_ENTITY_FRAME_WIDTH * 2,
            {x:0, y: 0}, {x: 3, y: 0},
            4, false, this.myScale);

        this.animation = this.stdAnimation;
        this.animation.pause();

        this.dragon = dragon;

        game.addEntity(this, LAYERS.ENEMIES);
    }

    update() {
        super.update();

        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;



    }
}

// class WoodDragonArm extends Enemy {
//     constructor(game, x, y, spawner, head) {
//         super(game, x, y, spawner);
//         this.head = head;
//     }
//
//     update() {
//         super.update();
//         if (this.head === null) {
//             this.destroy();
//         }
//     }
// }
//
// class WoodDragonLeftArm extends WoodDragonArm {
//
// }