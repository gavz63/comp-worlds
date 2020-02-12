const STANDARD_ENTITY_FRAME_WIDTH = 32;
const STANDARD_ENTITY_RADIUS = 20;
let ID = 0;

class Entity
{
	constructor(game, x, y)
	{
		this.game = game;
		this.animation = null;
		this.x = x;
		this.y = y;
		this.id = 0;
		this.removeFromWorld = false;
		this.speed = 100;
		
		this.circle = false;
		this.radius = 10;
    
    this.collider = new Collider(0, 0, 10, 10, 10, 10, null, 150);
    
    this.myScale = [5 * STANDARD_DRAW_SCALE];
    this.myAddScale = 5;
    
    this.oldPos = {x: 0, y: 0};
	}
  
  wallCollision(newPos)
  {
    let dir = dirV(this.oldPos, newPos);
    let xOffset = 0;
    let yOffset = 0;
    if(dir.y < 0)
    {
      yOffset = this.collider._upHit;
    }
    if(dir.y > 0)
    {
      yOffset = this.collider._downHit;
    }
    if(dir.x < 0)
    {
      xOffset = this.collider._leftHit;
    }
    if(dir.x > 0)
    {
      xOffset = this.collider._rightHit;
    }
    return this.game._sceneManager.level.quickCollision(coordinateToIndex(newPos.x + xOffset), coordinateToIndex(newPos.y + yOffset));
  }
	
	setAnimation(spritesheet)
	{
		this.animation = new Animation(spritesheet, 32, 32, {x: 0, y: 0}, {x: 0, y: 0}, 0, true, 10);
	}
	
	destroy()
	{
		this.removeFromWorld = true;
	}
	
	update()
	{
	}

	draw()
	{
		let screenPos = this.game._camera.drawPosTranslation({x: this.x, y: this.y}, 1);
		
		this.animation.drawFrame(this.game._clockTick, this.game._ctx, screenPos.x, screenPos.y, true);
	}
}