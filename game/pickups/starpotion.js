class StarPotion extends Entity {
    constructor(game, x, y) {
        super(game, x, y);
        game.addEntity(this, LAYERS.PICKUPS);
        this.addScale = 1.5;
        this.scale = [STANDARD_DRAW_SCALE * this.addScale];
        this.animation = new Animation(ASSET_MANAGER.getAsset("./img/pickups/potions.png"), 32, 32, {x: 0, y: 2}, {x: 1, y: 2}, 7, true, this.scale);
        this.collider = new Collider(0, 0, 8, 8, 8, 8, 12, Infinity);
    }

    update() {
        if(this.game._player !== undefined)
        {
          this.scale[0] = STANDARD_DRAW_SCALE * this.addScale;
          if (checkCollision({x: this.x, y: this.y}, this.collider, {x: this.game._player.x, y: this.game._player.y}, this.game._player._collider)) {
              console.log("mario star");
              this.destroy();
          }
        }
    }
}