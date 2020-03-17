class Post extends DestructableObject {
    constructor(game, x, y, falling = false) {
        super(game, x, y);

        this.targetLocation = {x: x, y: y};

        this.myAddScale = 3;
        this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];

        this.dir = normalizeV(dirV({x: this.x, y: this.y}, {x: this.game._camera.x, y: this.game._camera.y}));
        //this.x = this.x - this.dir.x * this.myScale[0]/3 * 2 * (Math.floor((6+1)/2) + 6);
        //this.y = this.y - this.dir.y * this.myScale[0]/3 * 2 * (Math.floor((6+1)/2) + 6);

        this.crosshair = new EnemyCrosshair(this.game, this.targetLocation.x, this.targetLocation.y);
        this.shadow = new Shadow(this.game, this.targetLocation.x, this.targetLocation.y, this);


        //this.y -= 2000;

        this.startX = this.x - this.dir.x * 10000;
        this.startY = this.y - this.dir.y * 10000;

        let that = this;
        let fallTime = 0;
        if (falling) {
            fallTime = RandomBetween(5, 10);
        }
        this.fallingTimer = new TimerCallback(this.game, fallTime, false, function () {
            that.fallingTimer = null;
            that.x = that.targetLocation.x;
            that.y = that.targetLocation.y;
            that.fallingSpeed = 1;
            that.crosshair = null;
            if (that.game.player && falling === true) {
                while (!that.removeFromWorld && !that.game.player.removeFromWorld &&
                    that.game.player.collider && that.collider &&
                    checkCollision(that, that.collider, that.game.player, that.game.player.collider)) {

                    let vec = normalizeV(dirV(that, that.game.player));
                    if (Math.abs(vec.y) > Math.abs(vec.x)) {
                        vec.x = 0;
                    } else if (Math.abs(vec.y) < Math.abs(vec.x)) {
                        vec.y = 0;
                    }
                    if (vec.x === 0 && vec.y === 0) {
                        vec.x = 1;
                    }

                    that.game.player.x += vec.x;
                    that.game.player.y += vec.y;

                    that.game.player.takeDmg(1, vectorToDir(that.dir));
                    if (that.game.player.wallCollision(that.game.player)) {

                        that.game.player.x -= vec.x;
                        that.game.player.y -= vec.y;
                        that.destroy();
                    }
                }
            }


            if(falling === true)
            {
              that.game.entities[LAYERS.ENEMIES].forEach(function (enemy) {
                  if (!(enemy instanceof WoodDragon || enemy instanceof WoodDragonHead || enemy instanceof WoodDragonArm) &&
                      !that.removeFromWorld && !enemy.removeFromWorld &&
                      enemy.collider && that.collider &&
                      checkCollision(that, that.collider, enemy, enemy.collider)) {

                      if (that.dieOnHit) {
                          that.destroy();
                      }
                      enemy.takeDamage(that.dmg, that.dir, that.knockBack);
                  }
              });
              this.game.entities[LAYERS.OBJECTS].forEach(function (object) {
                  if (that !== object) {
                      if (that.removeFromWorld !== true && object.removeFromWorld !== true &&
                          object.collider && that.collider &&
                          checkCollision(that, that.collider, object, object.collider)) {

                          object.destroy();
                      }
                  }
              });
            }
        });
        this.fallingSpeed = 0;

        this.hp = 6;

        this.animation = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
        this.animation.pause();
        this.animation.setFrame(8);

        this.deathAnimation = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 0}, {x: 8, y: 0}, 7, false, this.myScale);
        this.deathAnimation.pause();
        this.deathAnimation.setFrame(2);

        this.collider = new Collider(0, 0, 0, 0, 0, 0, 32, 150);
        this.inRange = false;
        this.weight = 10000;

        this.postSections = [];

        for (let i = 0; i < 5; i++) {
            let a = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
                STANDARD_ENTITY_FRAME_WIDTH,
                STANDARD_ENTITY_FRAME_WIDTH,
                {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
            a.pause();
            a.setFrame(7 - i);
            this.postSections.push(new PostSection(this.game, 0, 0, this, a, i + 1));
        }

        new DrawPost(this.game, 0, 0, this);

        //this.hitSounds.push("crateHit1");
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
    }

    destroy() {
        super.destroy();
        this.postSections.length = 0;
    }

    draw() {
        if (this.crosshair !== null) {
            this.crosshair.display();
        }
        super.draw();
    }

    update() {

        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;

        if (this.fallingTimer !== null) {
            let fallDir = dirV({x: this.startX, y: this.startY}, this.targetLocation);
            this.x = this.startX + fallDir.x * smoothStartN(this.fallingTimer.getPercent(), 2);
            this.y = this.startY + fallDir.y * smoothStartN(this.fallingTimer.getPercent(), 2);
            this.fallingSpeed = 10 * smoothStopN(this.fallingTimer.getPercent(), 3);
        } else if (this.game.game_state === GAME_STATES.PLAYING) {
            let that = this;
            if (this.game.sceneManager.level.mapElementAt({x: coordinateToIndex(this.x), y: coordinateToIndex(this.y)}) === "P") {
                this.destroy();
            }
            this.game.entities[LAYERS.ENEMIES].forEach(function (enemy) {
                if (!that.removeFromWorld && enemy.collider !== null) {
                    if (checkCollision(that, that.collider, enemy, enemy.collider)) {
                        that.takeDamage(1, {x: 1, y: 0}, 0);
                    }
                }
            });
            while (this.removeFromWorld !== true && this.game.player && checkCollision(this, this.collider, this.game.player, this.game.player._collider)) {
                let vec = normalizeV(dirV(this, this.game.player));
                if (Math.abs(vec.y) > Math.abs(vec.x)) {
                    vec.x = 0;
                } else if (Math.abs(vec.y) < Math.abs(vec.x)) {
                    vec.y = 0;
                }
                if (vec.x === 0 && vec.y === 0) {
                    vec.x = 1;
                }

                this.game.player.x += vec.x;
                this.game.player.y += vec.y;
            }
        }
        if (!this.removeFromWorld) {
            this.postSections[this.postSections.length - 1].animation.setFrame(Math.floor((6 - this.hp) / 2));
            for (let i = this.postSections.length - 1; i >= 0; i--) {
                this.postSections[i].update();
            }
        }
    }
}

class DrawPost extends Entity {
    constructor(game, x, y, owner) {
        super(game, x, y);
        this.owner = owner;

        this.game.addEntity(this, LAYERS.WALL);
    }

    update() {
    }

    draw() {
        for (let i = 0; i < this.owner.postSections.length; i++) {
            this.owner.postSections[i].display();
        }
    }

}

class PostSection extends Entity {
    constructor(game, x, y, owner, animation, offset) {
        super(game, owner.x, owner.y);

        this.myAddScale = 1.5;
        this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];

        this.owner = owner;
        this.animation = animation;
        this.offset = offset;
    }

    takeDamage() {
    }

    destroy() {
        this.removeFromWorld = true;
    }

    draw() {
    }

    display() {
        super.draw();
    }

    update() {
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
      
        if (this.owner) {
            this.dir = dirV({x: this.owner.x, y: this.owner.y}, {x: this.game._camera.x, y: this.game._camera.y});
            this.length = lengthV(this.dir);

            this.dir = normalizeV(this.dir);
            if (this.owner.fallingSpeed === 1) {
                this.x = this.owner.x - this.dir.x * this.myScale[0] / 3 * 5 * this.length / 480 * this.owner.fallingSpeed * (Math.floor((this.offset + 1) / 2) + this.offset);
                this.y = this.owner.y - this.dir.y * this.myScale[0] / 3 * 5 * this.length / 480 * this.owner.fallingSpeed * (Math.floor((this.offset + 1) / 2) + this.offset);
            } else {
                this.x = this.owner.x - this.dir.x * this.myScale[0] / 3 * 2 * this.owner.fallingSpeed * (Math.floor((this.offset + 1) / 2) + this.offset);
                this.y = this.owner.y - this.dir.y * this.myScale[0] / 3 * 2 * this.owner.fallingSpeed * (Math.floor((this.offset + 1) / 2) + this.offset);
            }
        }
    }
}