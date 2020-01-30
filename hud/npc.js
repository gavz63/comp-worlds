class NPC extends Entity {
    constructor(game, characterClass, hover = false) {
        super(game, characterClass.npc.x, characterClass.npc.y);
        this.characterClass = characterClass;
        this.animation = characterClass.animation.idleRight;
        this.animation.pause();
        let that = this;
        this.isIdling = false;
        this.idleTimer = new TimerCallBack(game, 5, true, function () {
            that.idle();
        });
        this.radius = 25;
        this.hover = hover;
        if (this.hover) {
            this.game.addEntity(new HoverArrow(this.game, this.x, this.y - 24), "hud");
        }
    }

    update() {
        if (this.isIdling && this.animation.isDone()) {
            this.isIdling = false;
            this.animation.resetAnimation();
            this.animation.pause();
        }

        //If we click on a character while in the character select, choose it and start the playing state
        if (this.game.game_state === GAME_STATES.CHARACTER_SELECT) {

            let cursorCenter = this.game.camera.clickPosTranslation({
                x: this.game.mouseX,
                y: this.game.mouseY
            });


            if (pointToCircle(cursorCenter, this, this.radius)) {
                if (this.game.click) {
                    this.game.click = false;
                    this.switchToPlayMode();
                } else if (!this.hover){
                    let i = 0;
                    for (i = 0; i < this.game.entities[4].length; i++) {
                        //remove all other hover arrows
                        if (this.game.entities[4][i] instanceof HoverArrow) {
                            this.game.entities[4][i].destroy();
                        }
                    }
                    for (i = 0; i < this.game.entities[3].length; i++) {
                        //set all other npcs' hover state to false
                        if (this.game.entities[3][i] instanceof NPC) {
                            this.game.entities[3][i].hover = false;
                        }
                    }
                    //create a new one and set this entity as the privileged hover npc
                    this.game.addEntity(new HoverArrow(this.game, this.x, this.y - 24), "hud");
                    this.hover = true;
                }
            }
            if (this.game.spacebar && this.hover) {
                this.switchToPlayMode();
            }
        }
    }

    idle() {
        this.animation.resetAnimation();
        this.animation.unpause();
        this.isIdling = true;
    }
    switchToPlayMode() {
        for (let i = 0; i < this.game.entities[4].length; i++) {
            if (this.game.entities[4][i] instanceof HoverArrow) {
                this.game.entities[4][i].destroy();
            }
        }
        this.game.game_state = GAME_STATES.PLAYING;
        this.destroy();
        new Player(this.game, this.characterClass);
        this.game.addEntity(new Tutorial(this.game), "hud");
    }
}