class EnemyCrosshair extends Entity
{
  constructor(game, x, y, owner, trackPlayer = false)
  {
    super(game, x, y);
    
    this.owner = owner;
    this.trackPlayer = trackPlayer;
    this.speed = 100;
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
  update() {
    super.update();
    this.myScale[0] = this.myAddScale * STANDARD_DRAW_SCALE;

    if (this.trackPlayer && this.game.player) {
      let dir = normalizeV(dirV(this, this.game.player));
      this.x += dir.x * this.game._clockTick * this.speed;
      this.y += dir.y * this.game._clockTick * this.speed;
    }
  }

  draw()
  {
    if (this.trackPlayer) {
      this.display();
    }
  }
  
  display()
  {
    super.draw();
  }
}