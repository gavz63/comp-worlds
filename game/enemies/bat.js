class Bat extends Enemy {
    constructor(game, x, y, spawner) {
        super(game, x, y, spawner);
        this.circle = Math.floor(Math.random() * 360);
        this._myScale = [2 * STANDARD_DRAW_SCALE];

        this.moveAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 0}, {x: 3, y: 0}, 10, true, this._myScale);
        this.attackAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 1}, {x: 3, y: 1}, 10, true, this._myScale);
        this.deathAnimation = new Animation(game.AM.getAsset("./img/enemies/Bat.png"),
            STANDARD_ENTITY_FRAME_WIDTH,
            STANDARD_ENTITY_FRAME_WIDTH,
            {x: 0, y: 2}, {x: 3, y: 2}, 10, false, this._myScale);

        this.animation = this.moveAnimation;

        this.speed = 100;
        this.collider = new Collider(0, 0, -13, 12, -15, 16, null, 150);
        this.oldCircle = 0;
        this.radius = STANDARD_ENTITY_RADIUS-5;
        this.inRange = false;

    }

    update() {
        this._myScale[0] = 2 * STANDARD_DRAW_SCALE;
        let attackVector = dirV({
            x: this.x,
            y: this.y
          }, {
              x: this.game._player.x,
              y: this.game._player.y
          });
		let length = lengthV(attackVector);
		attackVector = normalizeV(attackVector);
        if(length < 80) {
          if(this.inRange === false)
          {
            this.inRange = true;
            this.circle = Math.atan2(attackVector.y, attackVector.x);
            this.circle = this.circle * 180/Math.PI + 180;
          }
          else
          {
            this.oldCircle = this.circle;
            this.circle = (this.circle + this.speed * this.game._clockTick) % 360;
          }
          attackVector = normalizeV(dirV({
            x: this.x,
            y: this.y
          }, {
              x: this.game._player.x + (Math.cos((this.circle / 180) * Math.PI)) * (75),
              y: this.game._player.y + (Math.sin((this.circle / 180) * Math.PI)) * 75
          }));
        }
        else
        {
          this.inRange = false;
        }
        this.x += attackVector.x * this.speed * this.game._clockTick;
        this.y += attackVector.y * this.speed * this.game._clockTick;
        
        let newPos = {x: this.x, y: this.y};
        if(this.wallCollision(newPos))
        {
          this.x = this.oldPos.x;
          this.y = this.oldPos.y;
          this.circle = this.oldCircle;
        }
        else
        {
          this.oldPos = newPos;
        }
    }
}