class Remnant extends Entity
{
	constructor(game, x, y, animation)
  {
    super(game, x ,y);
    this.animation = animation;
    
    this.game.addEntity(this, LAYERS.FLOOR);
  }
  
  update = function ()
  {
    if(this.animation.isDone())
    {
      this.animation.pause();
      this.animation.setFrame(this.animation.getLastFrameAsInt());
      let that = this;
      this.update = function () {
      console.log(STANDARD_DRAW_SCALE);
      that.myScale[0] = STANDARD_DRAW_SCALE * that.myAddScale;};
    }
  }
}