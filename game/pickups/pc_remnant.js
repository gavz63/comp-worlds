class PCRemnant extends Entity {
    constructor(game, x, y, characterClass, animation) {
        super(game, x, y);
        this.characterClass = characterClass;
        this.animation = animation;
        this.animation.resetAnimation();
        this.radius = STANDARD_ENTITY_RADIUS;
        game.addEntity(this, LAYERS.PICKUPS);
    }

    update() {
        if(this.animation.isDone()) {
			this.animation.pause();
            this.animation.setFrame(this.animation.getLastFrameAsInt());
						console.log(this.animation.getFrame());
        }
		else{
			console.log("HEY");
		}
        if (circleToCircle(this, this.game.player)) {
            this.revive();
            this.destroy();
        }
    }

    revive() {
        this.game.sceneManager.revived.push(this);
    }
}