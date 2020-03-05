class ParticleEmitter extends Entity
{
  constructor(game, x, y, rate, startPos, endPos, startRange, endRange, startDir, endDir, startSpeed, endSpeed, startLifetime, endLifetime, startSize, endSize, startScale, endScale, colors, attached = null)
  {
    super(game, x, y);
    this.startPos = startPos;
    this.endPos = endPos;
    this.startRange = startRange;
    this.endRange = endRange;
    this.startDir = startDir;
    this.endDir = endDir;
    this.startSpeed = startSpeed;
    this.endSpeed = endSpeed;
    this.startLifetime = startLifetime;
    this.endLifetime = endLifetime;
    this.startSize = startSize;
    this.endSize = endSize;
    this.startScale = startScale;
    this.endScale = endScale;
    this.colors = colors;
    
    this.attached = attached;
    
    let that = this;
    this.timer = new TimerCallback(this.game, 1/rate, true, function () 
    {
      let pos = RandomBetween(that.startPos, that.endPos);
      let randomColors = [];
      for(let i = 0; i < that.colors.length; i += 2)
      {
        randomColors.push(RandomColorBetween(that.colors[i], that.colors[i+1]));
      }
      let p = new Particle(that.game,
      that.x + Math.cos(pos) * RandomBetween(that.startRange, that.endRange),
      that.y + Math.sin(pos) * RandomBetween(that.startRange, that.endRange),
      RandomBetween(that.startDir, that.endDir),
      RandomBetween(that.startSpeed, that.endSpeed),
      RandomBetween(that.startLifetime, that.endLifetime),
      RandomBetween(that.startScale, that.endScale),
      randomColors);
      
      p.myAddScale = RandomBetween(that.startSize, that.endSize);
      p.startScale = p.myAddScale;
    });
    this.game.addEntity(this, LAYERS.PARTICLES);
  }
  
  draw()
  {
  }
  
  update()
  {
    if(this.attached !== null)
    {
      this.x = this.attached.x;
      this.y = this.attached.y;
    }
  }
  
  destroy()
  {
    super.destroy();
    this.timer.pause();
    this.timer.destroy();
  }
}

class Particle extends Entity {
    constructor(game, x, y, dir, speed, lifetime, scale, colors, attached = null) {
        super(game, x, y);

        this.startX = x;
        this.startY = y;

        this.dx = 0;
        this.dy = 0;
        
        this.dir = {x: Math.cos(dir / 360 * 2 * Math.PI), y: Math.sin(dir / 360 * 2 * Math.PI)};
        this.speed = speed;

        this.lifetime = lifetime;
        
        this.scale = scale;
        this.startScale = 1/15;
        
        this.colors = colors;
        this.colorTime = this.lifetime/(this.colors.length-1);
        this.currentColor = 0;
        this.nextColor = 1;
        this.lastColor = this.colors.length-1;
        
        if(this.nextColor > this.lastColor)
        {
          this.nextColor = this.lastColor;
        }
        
        var that = this;
        this.timer = new TimerCallback(that.game, that.lifetime, false, function () {
            that.destroy();
        });
        
        this.ctx = game.ctx;
        this.attached = attached;
        
        this.myAddScale = 1/15;
        this.myScale = [STANDARD_DRAW_SCALE * this.myAddScale];        

        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/hud/ProgressBar.png"),
            STANDARD_ENTITY_FRAME_WIDTH, STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 0, y: 2},
            0, true, this.myScale);
        this.animation.pause();
        this.animation.setFrame(0);
        
        this.animation._color = MixColor(this.colors[this.currentColor], this.colors[this.nextColor], this.timer.getPercent()).getColor();
        this.animation._particle = true;
        this.game.addEntity(this, LAYERS.PARTICLES);
    }
    
    update()
    {
      this.x += this.dir.x * this.speed * this.game._clockTick;
      this.y += this.dir.y * this.speed * this.game._clockTick;
      if(this.nextColor * this.colorTime < this.timer.getTime())
      {
        this.currentColor += 1;
        this.nextColor += 1;
        if(this.nextColor > this.lastColor)
        {
          this.nextColor = this.lastColor;
        }
      }
      
      this.myAddScale = mix(this.startScale, this.startScale * this.scale, this.timer.getPercent());
      
      this.animation._color = MixColor(this.colors[this.currentColor], this.colors[this.nextColor], this.timer.getPercent()).getColor();
      /*
      this.x = this.startX + this.dx;
      this.y = this.startY + this.dy;
      */
      
      this.myScale[0] = STANDARD_DRAW_SCALE * this.myAddScale;
    }
}