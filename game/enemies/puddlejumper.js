class PuddleJumper extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        //console.log("HELLO:");
        this.moveAnimation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleJumper.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 2, y: 5}, 12, true, STANDARD_DRAW_SCALE);
        this.attackAnimation = null;
        this.deathAnimation = new Animation(this.game.AM.getAsset("./img/enemies/PuddleDeath.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 4, y: 0}, 12, false, STANDARD_DRAW_SCALE);

        this.animation = this.moveAnimation;

        this.speed = 300;
        this.radius = STANDARD_ENTITY_RADIUS;
        this.directionSet = false;
        this.targetVector = null;
    }

    update() {
        if (this.animation._elapsedTime > this.animation._totalTime * 14 / STANDARD_ENTITY_FRAME_WIDTH &&
            this.animation._elapsedTime < this.animation._totalTime * 19 / STANDARD_ENTITY_FRAME_WIDTH) {
            
            
            if(!this.directionSet)
            {
			
              this.targetVector = normalizeV(dirV({x: this.x, y: this.y}, {x: this.game._player.x, y: this.game._player.y}));
              this.directionSet = true;
            }
            
            this.x += this.targetVector.x * this.game._clockTick * this.speed;
            this.y += this.targetVector.y * this.game._clockTick * this.speed;
        }
        else
        {
          this.directionSet = false;
        }
    }
}