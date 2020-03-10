class Post extends DestructibleObject {
    constructor(game, x, y) {
        super(game, x, y);
        
        this.myAddScale = 3;
        this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];

        this.animation = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
        this.animation.pause();
        this.animation.setFrame(0);
        
        this.deathAnimation = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 1, y: 0}, {x: 8, y: 0}, 7, false, this.myScale);
        this.deathAnimation.pause();
        this.deathAnimation.setFrame(3);
        
        this.collider = new Collider(0, 0, -13, 12, -15, 16, null, 150);
        this.radius = STANDARD_ENTITY_RADIUS - 5;
        this.inRange = false;
        
        //this.hitSounds.push("crateHit1");
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
    }
    
    update() {

    }
}

class PostSection extends Object
{
  constructor(game, x, y, owner, animation, offset)
  {
    super(game, owner.x, owner.y);
    this.owner = owner;
    this.animation = animation;
    this.offset = offset;
  }
  
  update()
  {
    let dir = dirV({x: this.x, y: this.y}, {x: this.game._camera.x, y: this.game._camera.y});
    this.x = this.owner.x + dir.x * this.offset;
    this.y = this.owner.y + dir.y * this.offest;
  }
}