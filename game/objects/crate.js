class Crate extends DestructableObject {
    constructor(game, x, y) {
        super(game, x, y);
        
        this.myAddScale = 3;
        this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];

        this.animation = new Animation(game.AM.getAsset("./img/objects/Crate.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 1, y: 0}, 10, true, this.myScale);
        this.deathAnimation = new Animation(game.AM.getAsset("./img/objects/Crate.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 0}, {x: 3, y: 0}, 7, false, this.myScale);

        this.animation.pause();
        this.animation.setFrame(0);
        
        this.collider = new Collider(0, 0, -13, 12, -15, 16, STANDARD_ENTITY_RADIUS-5, 150);
        this.inRange = false;
        
        //this.hitSounds.push("crateHit1");
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
    }

    update() {
      this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
    
      this.animation.pause();
      this.animation.setFrame(2 - Math.ceil(this.hp));
    }

}