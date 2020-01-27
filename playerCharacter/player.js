/**
 * @author Gordon McCreary, Joel Johnson, Gavin Montes
 * @param game, a reference to the game engine
 * @param characterClass, the class that the player has chosen (Lancer, Black Mage, etc.)
 * @constructor
 */
function Player(game, characterClass) {
    var that = this;
    this.game = game;

    this.characterClass = characterClass;
    this.direction = DIRECTION_RIGHT;
    this.animation = characterClass.animation.idleRight;
    this.animation.pause();

    this.x = 0;
    this.y = 0;
    this.speed = characterClass.stats.speed;
    this.hp = characterClass.stats.maxHP;
    this.velocity = {x: 0, y: 0};

    this.isMoving = false;
    this.isTakingDmg = false;
    this.isAttacking = false;
    this.isIdling = false;

    //Will never be removed from world because it is looping
    this.idleTimer = new TimerCallBack(this.game,
        5, true,
        function () {
            that.idle();
        }); // Had to do it this way to preserve the this identity.

    this.game.addTimer(this.idleTimer);
}

/**
 * Draw the player in the state and position it is currently in.
 * TODO check if attacking
 */
Player.prototype.draw = function () {
    this.animation.drawFrame(this.game._clockTick, this.game.ctx, this.x, this.y, false);
};
/**
 * Part of the game loop, update the player to the position and state it should now be in.
 */
Player.prototype.update = function () {

    // // Are we (still) taking damage?
    // if (this.isTakingDmg) {
    //     if (this.animation.isDone()) {
    //         this.isTakingDmg = false;
    //     } else {
    //         //Continue direction (being thrown from the damage) SET VELOCITY ABOVE
    //
    //     }
    // }

    // If we are done attacking, stop the attack animation
    if (this.isAttacking && this.animation.isDone()) {
        this.isAttacking = false;
    }

    //If we are done taking damage, we are allowed to do other things
    if (!this.isTakingDmg) {
        //If we have received input we must be moving and/or attacking
        if (this.game.change) {
            //If we're moving
            if (this.game.keyStack.length > 0 && !this.isAttacking) {

                console.log(this.game.lastKey);

                //Set animation to the walking animation
                if (this.game.lastKey === "KeyW") {
                    this.direction = DIRECTION_UP;
                    this.animation = this.characterClass.animation.walkingUp;
                } else if (this.game.lastKey === "KeyA") {
                    this.direction = DIRECTION_LEFT;
                    this.animation = this.characterClass.animation.walkingLeft;
                } else if (this.game.lastKey === "KeyS") {
                    this.direction = DIRECTION_DOWN;
                    this.animation = this.characterClass.animation.walkingDown;
                } else if (this.game.lastKey === "KeyD") {
                    this.direction = DIRECTION_RIGHT;
                    this.animation = this.characterClass.animation.walkingRight;
                }
            }

            //Attack animation should supersede walking animation, so we can attack while moving
            if (this.game.click) {
                this.regularAttack();
            }

            //Reset to false now that we have finished input-based updating
            this.game.change = false;

            //If we were idle we aren't anymore, so reset the idle timer
            this.idleTimer.pause();
            this.idleTimer.reset();
            this.isIdling = false;
            this.animation.unpause();
        }
        // If game.change was not set, we have been idling
        else if (!(this.game.w || this.game.a || this.game.s || this.game.d || this.isAttacking)) {
            //Make sure we're using the proper idle animation
            switch (this.direction) {
                case DIRECTION_RIGHT:
                    this.animation = this.characterClass.animation.idleRight;
                    break;
                case DIRECTION_DOWN:
                    this.animation = this.characterClass.animation.idleDown;
                    break;
                case DIRECTION_LEFT:
                    this.animation = this.characterClass.animation.idleLeft;
                    break;
                case DIRECTION_UP:
                    this.animation = this.characterClass.animation.idleUp;
                    break;
            }

            /* If idle() has already been called and we are in the middle of
            playing the idle animation */
            if (this.isIdling) {
                //If the animation is finished, reset to single frame and reset idleTimer
                if (this.animation.isDone()) {
                    console.log("Idle done");
                    this.isIdling = false;
                     this.animation.pause();
                    this.idleTimer.reset();
                } else {
                    //Idle animation should be playing
                    this.animation.unpause();
                    this.idleTimer.pause();
                }
            } else {
                //Make sure we continue ticking idle timer so we can get there.
                this.idleTimer.unpause();
                this.animation.pause();
            }
        }

        this.velocity = {x: 0, y: 0};

        if (this.game.w) {
            this.velocity.y = -1;
        }
        if (this.game.a) {
            this.velocity.x = -1;
        }
        if (this.game.s) {
            this.velocity.y = 1;
        }
        if (this.game.d) {
            this.velocity.x = 1;
        }
    }

    // //Enemies
    // this.game.entities[1].forEach(function (elem) {
    //     //If we're collided
    //     if (circleToCircle(this, elem)) {
    //         this.takeDmg(elem.dmg, elem.direction)
    //     }
    // });
    //
    // //Projectiles and pickups
    // this.game.entities[2].forEach(function (elem) {
    //     //If we're collided
    //     if (circleToCircle(this, elem)) {
    //         if (elem instanceof Projectile) {
    //             if (elem.owner !== this) {
    //                 this.takeDmg(1, vectorToDir(elem.dir));
    //             }
    //         }
    //         // if (elem instanceof Pickup) {
    //         //     this.pickup(elem);
    //         // }
    //     }
    // });

    this.velocity = scaleV(normalizeV(this.velocity), this.speed);


    this.game._camera.x += this.velocity.x * this.game._clockTick; //
    this.game._camera.y += this.velocity.y * this.game._clockTick; // Always move the camera

    this.x = this.game.ctx.canvas.width / 2; // keep player centered
    this.y = this.game.ctx.canvas.height / 2;

    //this.x += this.velocity.x * this.game._clockTick;
    //this.y += this.velocity.y * this.game._clockTick;

    //first crack at the bounding box
    // let scrolling = false;
    //
    // if(this.x > this.game.ctx.canvas.width * 2/3)
    // {
    //     scrolling = true;
    //     this.x = this.game.ctx.canvas.width * 2/3;
    // }
    // if(this.x < this.game.ctx.canvas.width * 1/3)
    // {
    //     scrolling = true;
    //     this.x = this.game.ctx.canvas.width * 1/3;
    // }
    // if(this.y > this.game.ctx.canvas.height * 2/3)
    // {
    //     scrolling = true;
    //     this.y = this.game.ctx.canvas.height * 2/3;
    // }
    // if(this.y < this.game.ctx.canvas.height * 1/3)
    // {
    //     scrolling = true;
    //     this.y = this.game.ctx.canvas.height * 1/3;
    // }
    //
    // if(scrolling === true)
    // {
    //     this.game._camera.x += this.velocity.x * this.game._clockTick;
    //     this.game._camera.y += this.velocity.y * this.game._clockTick;
    // }
    //bounding camera


    //this.game._camera.x += this.x;
    //this.game._camera.y += this.y;

};
/**
 * Controls the idle animation of the player.
 * Runs every time the idle timer finishes.
 */
Player.prototype.idle = function () {
    console.log("Idle: " + this.animation._paused);
    this.animation.resetAnimation();
    this.animation.unpause();
    this.isIdling = true;
};
/**
 * Handles the player being hit. This will put them in the "taking damage" state and reduce their hp.
 * @param dmg the amount of damage they are taking, hp will be reduced by this amount
 * @param direction, the direction from which we were hit, so that the player can fly back from the impact.
 */
Player.prototype.takeDmg = function (dmg, direction) {
    this.hp -= dmg;
    this.isTakingDmg = true;
    switch (direction) {
        case DIRECTION_LEFT:
            this.animation = this.characterClass.dmgFromRight;
            break;
        case DIRECTION_RIGHT:
            this.animation = this.characterClass.dmgFromLeft;
            break;
        case DIRECTION_UP:
            this.animation = this.characterClass.dmgFromDown;
            break;
        case DIRECTION_DOWN:
            this.animation = this.characterClass.dmgFromUp;
    }
};
/**
 * Handles a regular attack (left click)
 */
Player.prototype.regularAttack = function () {
    this.isAttacking = true;
    this.game.click = false;
    var attackDir = vectorToDir(normalizeV(dirV(
        this.animation.getCenter(this.x, this.y),
        {
            x: this.game.mouseX,
            y: this.game.mouseY
        })
    ));
    var projectileAnimation = null;
    switch (attackDir) {
        case DIRECTION_DOWN:
            this.animation = this.characterClass.animation.regAttackDown;
            projectileAnimation = this.characterClass.animation.regProjectileDown;
            break;
        case DIRECTION_UP:
            this.animation = this.characterClass.animation.regAttackUp;
            projectileAnimation = this.characterClass.animation.regProjectileUp;
            break;
        case DIRECTION_LEFT:
            this.animation = this.characterClass.animation.regAttackLeft;
            projectileAnimation = this.characterClass.animation.regProjectileLeft;
            break;
        case DIRECTION_RIGHT:
            this.animation = this.characterClass.animation.regAttackRight;
            projectileAnimation = this.characterClass.animation.regProjectileRight;
            break;
        default:
            break;
    }
    this.animation.resetAnimation();
    this.animation.unpause();
    this.direction = attackDir;
    console.log("Creating Projectile at: " + this.x + ", " + this.y);
    let projectile = new Projectile(this.game,
        this.x, this.y,
        normalizeV(dirV(this.animation.getCenter(this.x, this.y), {
            x: this.game.mouseX,
            y: this.game.mouseY
        })),
        1000, 0.5, this, projectileAnimation);
    this.game.addEntity(projectile, "pps");
};