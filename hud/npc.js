class NPC {
    constructor(game, characterClass, x, y) {
        this.game = game;
        this.characterClass = characterClass;
        this.animation = characterClass.animation.idleRight;
        this.animation.pause();
        let that = this;
        this.isIdling = false;
        this.idleTimer = new TimerCallBack(game, 5, true, function () {
            that.idle();
        });
        this.x = x;
        this.y = y;
        this.radius = 25;
    }

    update() {
        if (this.isIdling && this.animation.isDone()) {
            this.isIdling = false;
            this.animation.pause();
        }

        //If we click on a character while in the character select, choose it and start the playing state
        if (this.game.game_state === GAME_STATES.CHARACTER_SELECT) {

            if (this.game.click) {
                this.game.click = false;
                let cursorCenter = this.game.camera.clickPosTranslation({
                        x: this.game.mouseX,
                        y: this.game.mouseY
                });
                console.log(cursorCenter);
                console.log(this.x + ", " + this.y);
                if (pointToCircle(cursorCenter, this, this.radius)) {
                    console.log(cursorCenter);
                    this.game.game_state = GAME_STATES.PLAYING;
                    this.removeFromWorld = true;
                    new Player(this.game, this.characterClass);
                }
            }
        }
    }

    draw() {
        let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
        this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true); // do not draw world pos
    }

    idle() {
        this.animation.resetAnimation();
        this.animation.unpause();
        this.isIdling = true;
    }
}