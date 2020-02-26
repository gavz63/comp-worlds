class ProgressBar extends Entity
{
  constructor(game, x, y, width, chargeAmount)
  {
    super(game, x, y);
    
    this.offsetX = x;
    this.offsetY = y;
    this.width = width;
    this.progress = 100;
    this.amt = chargeAmount;
    let that = this;
    this.attached = null;
    this.paused = false;
    this.barBack = new Bar(this.game, 0, 0, this);
    this.barBack.isBack = true;
    this.barBack.animation.setFrame(2);
    this.barFront = new Bar(this.game, 0, 0, this);
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  update()
  {
	if(!this.paused)
	{
		this.progress += this.amt * this.game._clockTick;
	}
	if (this.progress < 100)
	{
	  this.barFront.animation.setFrame(1);
	}
	else
	{
	  this.progress = 100;
	  this.barFront.animation.setFrame(0);
	}
    if(this.attached !== null)
    {
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
    }
  }
  
  draw()
	{
    this.barBack.display();
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

class Bar extends Entity
{

  constructor(game, x, y, attached)
  {
    super(game, x, y);
    this.offsetX = x;
    this.offsetY = y;
    this.attached = attached;
    this.isBack = false;
      
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/ProgressBar.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 2},
            0, true, attached.myScale);
			
    this.animation._height = this.animation._frameHeight / 10;
    
    this.game.addEntity(this, LAYERS.HUD);
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
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
	  
	  if(!this.isBack)
	  {
      let t = this.attached.progress / 100;
      this.animation._width = mix(smoothStartN(t, 3), smoothStopN(t, 3), t) * this.attached.width;
	  }
	  else
	  {
		  this.animation._width = this.attached.width;
	  }
  }
}