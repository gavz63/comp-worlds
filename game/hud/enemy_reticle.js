class EnemyCrosshair extends Entity
{
  constructor(game, x, y)
  {
    super(game, x, y);
    
    this.animation = new Animation(game.AM.getAsset("./img/objects/EnemyCrosshair.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 8, y: 0}, 10, true, this.myScale);
  }
}