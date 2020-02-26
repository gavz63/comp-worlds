class HealthBar extends Entity
{
  constructor(game, x, y, width, owner)
  {
    super(game, x, y);
    
    this.offsetX = x;
    this.offsetY = y;
    this.width = width;
    this.owner = owner;
    this.healAmt = 0;
    this.attached = null;
    this.paused = false;
    
    this.barBack = new HpBar(this.game, 0, 0, this);
    this.barBack.isBack = true;
    this.barBack.animation.setFrame(2); // set back to black
    
    this.barFront = new HpBar(this.game, 0, 0, this); // set front to light red
    this.barFront.animation.setFrame(0);
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  update()
  {
    if(this.attached !== null)
    {
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
    }
  }
  
  draw()
	{
   // this.barBack.display();
    this.barFront.display();
	}
  
  attachTo(attached)
  {
    this.attached = attached;
  }
  
  destroy()
  {
    super.destroy();
    this.barBack.destroy();
    this.barFront.destroy();
  }
}

class HpBar extends Entity
{

  constructor(game, x, y, attached)
  {
    super(game, x, y);
    this.offsetX = x;
    this.offsetY = y;
    this.attached = attached;
    this.isBack = false;
      
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/HealthBar.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 2},
            0, true, attached.myScale);
			
    this.animation._height = this.animation._frameHeight * 3;
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  draw()
  {
  }
  
  display() // this is done to ensure the order is preserved.
  {
    this.animation.drawFrame(this.game._clockTick, this.game._ctx, this.x, this.y, true);
  }
  
  update()
  {
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
	  
	  if(!this.isBack)
	  {
      let t = this.attached.owner.hp / 100;
      this.animation._width = mix(smoothStartN(t, 3), smoothStopN(t, 3), t) * this.attached.width;
	  }
	  else
	  {
		  this.animation._width = this.attached.width;
	  }
  }
}