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

        this.speed = 100;
        this.collider = new Collider(0, 0, -28, 28, -30, 30, null, 150); // 12,12,14,14
        this.radius = STANDARD_ENTITY_RADIUS;
        this.isWaiting = false;
        this.isAttacking = false;
        this.goalPoint = null;
        this.hp = 4;
        this.wait();
    }

    update() {
        super.update();
        this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;

        this.pathfind(1000, 50);
        if (this.goalPoint) {
            this.go(normalizeV(dirV(this, this.goalPoint)));
        }

        // if (!this.isWaiting) {
        //     let vecToPlayer = dirV(this, this.game.player);
        //
        //     if (this.isAttacking) {
        //         if (this.animation.isDone()) {
        //             this.backToNormal();
        //             this.wait();
        //         }
        //     } else {
        //         if (this.goalPoint) {
        //             let vecToGoal = dirV(this, this.goalPoint);
        //
        //             //If player is in same direction as goal point
        //             if (((vecToPlayer.x <= 0 && vecToGoal.x <= 0) || (vecToPlayer.x > 0 && vecToGoal.x > 0)) &&
        //                 ((vecToPlayer.y <= 0 && vecToGoal.y <= 0) || (vecToPlayer.y > 0 && vecToGoal.y > 0))) {
        //                 if (!this.isCharging) {
        //                     this.charge();
        //                 } else if (lengthV(vecToPlayer) < 5) {
        //                     this.backToNormal();
        //                     this.attack();
        //                 }
        //             } else {
        //                 this.go(normalizeV(vecToGoal));
        //             }
        //         } else {
        //             this.pathfind(1000, 50);
        //         }
        //
        //     }
        //
        //     let newPos = {x: this.x, y: this.y};
        //     if (this.wallCollision(newPos)) {
        //         this.x = this.oldPos.x;
        //         this.y = this.oldPos.y;
        //         this.backToNormal();
        //         this.attack();
        //         this.pathfind(1000, 50);
        //     } else {
        //         this.oldPos = newPos;
        //     }
        // }
    }

    charge() {
        this.goalPoint = {x: this.game.player.x, y: this.game.player.y};

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
    }

    wait() {
        this.isWaiting = true;
        let that = this;
        new TimerCallback(this.game, 3, false, function () {
            that.isWaiting = false;
        })
    }
}