class EnemyCrosshair extends Entity
{
  constructor(game, x, y, owner)
  {
    super(game, x, y);
    
    this.owner = owner;
    
    this.myAddScale = 3;
    this.myScale = [this.myAddScale * STANDARD_DRAW_SCALE];
    
    this.animation = new Animation(game.AM.getAsset("./img/hud/EnemyCrosshair.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 0}, 10, false, this.myScale);
    this.animation.pause();
    this.animation.setFrame(0);
    
    this.game.addEntity(this, LAYERS.HUD);
  }
  
  draw()
  {
  }
  
  display()
  {
    super.draw();
  }
}