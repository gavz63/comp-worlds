class Heart extends Entity
{
  constructor(game, x, y)
  {
    super(game,x,y);
    this.full = true;
    
    let ratio = this.game._ctx.canvas.width / this.game._ctx.canvas.height;
    if(ratio < 1)
    {
      ratio = 1/ratio;
    }
    if(ratio > 2)
    {
      ratio = 2;
    }

    this.myScale = [2*ratio];
    
    this.animation = new Animation(game.AM.getAsset("./img/hud/Heart.png"),
			STANDARD_ENTITY_FRAME_WIDTH,
			STANDARD_ENTITY_FRAME_WIDTH,
			{x: 0, y: 0}, {x: 3, y: 0}, 10, true, this.myScale);
      
    this.animation.pause();
    this.set(true);
      
    this.game.addEntity(this, LAYERS.HUD);

  }
  
  update()
  {
    let ratio = this.game._ctx.canvas.width / this.game._ctx.canvas.height;
    if(ratio < 1)
    {
      ratio = 1/ratio;
    }
    if(ratio > 2)
    {
      ratio = 2;
    }
    this.myScale[0] = 2*ratio;
  }
  
  draw()
  {
    this.animation.drawFrame(this.game._clockTick, this.game._ctx, this.x, this.y, true);
  }
  
  set(fullness)
  {
    this.full = fullness;
    if(this.full)
    {
      this.animation.setFrame(3);
    }
    else
    {
      this.animation.setFrame(0);
    }
  }
}

class LastHeart extends Heart
{
  constructor(game, x, y)
  {
    super(game, x, y);
  }
  
  set(fullness)
  {
    this.full = fullness;
    if(this.full)
    {
      this.animation.pause();
      this.animation.setFrame(3);
    }
    else
    {
      this.animation.unpause();
      this.animation.resetAnimation();
    }
  }
}