class Post extends DestructableObject {
    constructor(game, x, y) {
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
        this.fallingTimer = new TimerCallback(this.game, RandomBetween(5,10), false, function () { that.fallingTimer = null;
          that.x = that.targetLocation.x;
          that.y = that.targetLocation.y;
          that.fallingSpeed = 1;
          that.crosshair = null;});
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
        
        //this.collider = new Collider(0, 0, -13, 12, -15, 16, 32, 150);
        this.radius = 32;
        this.inRange = false;
        this.weight = 10000;
        
        this.postSections = [];
        
        for(let i = 0; i < 5; i++)
        {
          let a = new Animation(game.AM.getAsset("./img/objects/LogPost.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
          a.pause();
          a.setFrame(7 - i);
          this.postSections.push(new PostSection(this.game, 0, 0, this, a, i+1));
        }
        
        
        //this.hitSounds.push("crateHit1");
        this.hitSounds.push("crateHit2");
        this.destroySounds.push("crateBroken");
    }
    
    destroy()
    {
      super.destroy();
      this.postSections.length = 0;
    }
    
    draw()
    {
      if(this.crosshair !== null)
      {
        this.crosshair.display();
      }
      super.draw();
      for(let i = 0; i < this.postSections.length; i++)
      {
        this.postSections[i].display();
      }

    }
    
    update() {
      
        this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;
      
      if(this.fallingTimer !== null)
      {
        let fallDir = dirV({x: this.startX, y: this.startY}, this.targetLocation);
        this.x = this.startX + fallDir.x * smoothStartN(this.fallingTimer.getPercent(), 2);
        this.y = this.startY + fallDir.y * smoothStartN(this.fallingTimer.getPercent(), 2);
        this.fallingSpeed = 10 * smoothStopN(this.fallingTimer.getPercent(), 3);
      }
      this.postSections[this.postSections.length-1].animation.setFrame( Math.floor((6 - this.hp)/2) );
      for(let i = this.postSections.length-1; i >= 0; i--)
      {
        this.postSections[i].update();
      }
    }
}

class PostSection extends DestructableObject
{
  constructor(game, x, y, owner, animation, offset)
  {
    super(game, owner.x, owner.y);
    
    this.myAddScale = 1.5;
    this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];
    
    this.owner = owner;
    this.animation = animation;
    this.offset = offset;
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
    if(this.owner)
    {
      this.dir = dirV({x: this.owner.x, y: this.owner.y}, {x: this.game._camera.x, y: this.game._camera.y});
      this.length = lengthV(this.dir);

      this.dir = normalizeV(this.dir);
      if(this.owner.fallingSpeed === 1)
      {
        this.x = this.owner.x - this.dir.x * this.myScale[0] /3 * 5 * this.length / 480 *  this.owner.fallingSpeed * (Math.floor((this.offset+1)/2) + this.offset);
        this.y = this.owner.y - this.dir.y * this.myScale[0] /3 * 5 * this.length / 480 *  this.owner.fallingSpeed * (Math.floor((this.offset+1)/2) + this.offset);
      }
      else
      {
        this.x = this.owner.x - this.dir.x * this.myScale[0] /3 * 2 * this.owner.fallingSpeed * (Math.floor((this.offset+1)/2) + this.offset);
        this.y = this.owner.y - this.dir.y * this.myScale[0] /3 * 2 * this.owner.fallingSpeed * (Math.floor((this.offset+1)/2) + this.offset);
      }
    }
  }
}