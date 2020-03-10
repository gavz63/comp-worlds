class Post extends DestructableObject {
    constructor(game, x, y) {
        super(game, x, y);
        
        this.myAddScale = 1.5;
        this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];
        
        this.hp = 6;

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
        this.deathAnimation.setFrame(2);
        
        this.collider = new Collider(0, 0, -13, 12, -15, 16, null, 150);
        this.radius = 32;
        this.inRange = false;
        
        this.postSections = [];
        
        for(let i = 0; i < 5; i++)
        {
          let a = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
          a.pause();
          a.setFrame(i+4);
          this.postSections.push(new PostSection(this.game, 0, 0, this, a, i+1));
        }
        
        
        //this.hitSounds.push("crateHit1");
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
    }
    
    destroy()
    {
      super.destroy();
      for(let i = this.postSections.length-1; i >= 0; i--)
      {
              console.log(this.hp);
        this.postSections[i].destroy();
      }
      this.postSections.length = 0;
    }
    
    draw()
    {
      for(let i = this.postSections.length-1; i >= 0; i--)
      {
              console.log(this.hp);
        this.postSections[i].display();
      }
      super.draw();
    }
    
    update() {
      console.log(this.hp);
      this.animation.setFrame( Math.floor((6 - this.hp)/2) );
    }
}

class PostSection extends DestructableObject
{
  constructor(game, x, y, owner, animation, offset)
  {
    super(game, owner.x, owner.y);
    this.owner = owner;
    this.animation = animation;
    this.offset = offset;
    
    this.game.addEntity(this, LAYERS.OBJECTS);
  }
  
  takeDamage()
  {
  }
  
  destroy()
  {
    this.removeFromWorld = true;
  }
  
  draw()
  {
  }
  
  display()
  {
    super.draw();
  }
  
  update()
  {
    this.dir = normalizeV(dirV({x: this.owner.x, y: this.owner.y}, {x: this.game._camera.x, y: this.game._camera.y}));
    this.x = this.owner.x + this.dir.x * this.myScale[0] * 2 * (Math.floor((this.offset+1)/2) + this.offset);
    this.y = this.owner.y + this.dir.y * this.myScale[0] * 2 * (Math.floor((this.offset+1)/2) + this.offset);
  }
}