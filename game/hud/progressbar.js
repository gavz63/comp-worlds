class ProgressBar extends Entity
{
  constructor(game, x, y)
  {
    super(game, x, y);
    
    this.offsetX = x;
    this.offsetY = y;
    this.progress = 10;
    this.lastProgress = 10;
    let that = this;
    this.timer = new TimerCallback(game, game.player.characterClass.stats.specialChargeTime/10, true, function() 
      { 
        if(that.progress < 10)that.progress++;
      }
    );
    this.attached = null;
    
    this.bars = [];
    for(let i = 0; i < 10; i++)
    {
      let bar = new Bar(this.game, 0, 0, this);
      bar.offsetX = i * (bar.myScale * 16 + 1);
      this.bars.push(bar);
    }
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  update()
  {
    if(this.progress > 10)
    {
      this.progress = 10;
    }
    if(this.attached !== null)
    {
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
    }
    if(this.lastProgress !== this.progress)
    {
      let start = this.lastProgress;
      let end = this.progress;
      let frame = 0;
      if(start > end)
      {
        start = this.progress;
        end = this.lastProgress;
        frame = 1;
      }
      for(let i = start; i < end; i++)
      {
        this.bars[i].animation.setFrame(frame);
      }
      this.lastProgress = this.progress;
    }
  }
  
  draw()
	{
	}
  
  attachTo(attached)
  {
    this.attached = attached;
  }
  
  destroy()
  {
	  for(let i = 0; i < 10; i++)
	  {
		  this.bars[i].destroy();
	  }
  }
}

class Bar extends Entity
{

  constructor(game, x, y, attached)
  {
    super(game, x, y);
    this.addScale = 0.1;
    this.myScale[0] = STANDARD_DRAW_SCALE * this.addScale;
    this.offsetX = x;
    this.offsetY = y;
    this.progress = 10;
    this.lastProgress = 10;
    this.attached = attached;
    
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/ProgressBar.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 1},
            0, true, this.myScale);
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  update()
  {
      this.x = this.attached.x + this.offsetX;
      this.y = this.attached.y + this.offsetY;
  
      this.myScale[0] = STANDARD_DRAW_SCALE * this.addScale;
  }
}